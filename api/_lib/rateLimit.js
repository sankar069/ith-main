/**
 * Rate limiting for serverless/Vercel environment
 * 
 * IMPORTANT: This uses an in-memory store which is suitable for:
 * - Development
 * - Low-traffic applications
 * - Basic protection
 * 
 * For production high-traffic, use Upstash Redis or Vercel KV:
 * npm install @upstash/ratelimit @upstash/redis
 * 
 * See SECURITY_REMEDIATION_REPORT.md for upgrade instructions
 */

// In-memory store for rate limiting
// NOTE: Resets when serverless function cold-starts
const rateLimitStore = new Map();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limiter configuration
 */
const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - 5 attempts per 15 minutes
  'auth:login': {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.'
  },
  
  // Password reset - 3 attempts per hour
  'auth:reset': {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many password reset attempts. Please try again later.'
  },
  
  // Generic API - 100 requests per minute
  'api:general': {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.'
  }
};

/**
 * Create rate limit key from request
 */
function getRateLimitKey(req, identifier) {
  // Use IP address + identifier for better isolation
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
             req.headers['x-real-ip'] || 
             req.socket?.remoteAddress || 
             'unknown';
  return `${ip}:${identifier}`;
}

/**
 * Check if request is rate limited
 * @param {string} limitType - Type of rate limit (from RATE_LIMIT_CONFIGS)
 * @param {string} identifier - Unique identifier (email, user ID, etc.)
 * @returns {Object} - { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(req, limitType, identifier = 'default') {
  const config = RATE_LIMIT_CONFIGS[limitType];
  if (!config) {
    console.error(`Unknown rate limit type: ${limitType}`);
    return { allowed: true, remaining: 999, resetTime: Date.now() };
  }

  const key = getRateLimitKey(req, `${limitType}:${identifier}`);
  const now = Date.now();
  
  let limitData = rateLimitStore.get(key);
  
  // Initialize or reset if window expired
  if (!limitData || now > limitData.resetTime) {
    limitData = {
      attempts: 0,
      resetTime: now + config.windowMs
    };
  }
  
  limitData.attempts++;
  rateLimitStore.set(key, limitData);
  
  const remaining = Math.max(0, config.maxAttempts - limitData.attempts);
  const allowed = limitData.attempts <= config.maxAttempts;
  
  return {
    allowed,
    remaining,
    resetTime: limitData.resetTime,
    retryAfter: Math.ceil((limitData.resetTime - now) / 1000) // seconds
  };
}

/**
 * Middleware-style rate limiter
 * Throws AuthError if rate limit exceeded
 */
export async function rateLimit(req, limitType, identifier = 'default') {
  const { allowed, remaining, retryAfter } = checkRateLimit(req, limitType, identifier);
  
  if (!allowed) {
    const config = RATE_LIMIT_CONFIGS[limitType];
    const error = new Error(config.message);
    error.status = 429;
    error.retryAfter = retryAfter;
    error.remaining = 0;
    throw error;
  }
  
  return { remaining, retryAfter };
}

/**
 * Reset rate limit for a specific identifier (e.g., after successful login)
 */
export function resetRateLimit(req, limitType, identifier) {
  const key = getRateLimitKey(req, `${limitType}:${identifier}`);
  rateLimitStore.delete(key);
}

/**
 * Express/Vercel middleware wrapper
 */
export function rateLimitMiddleware(limitType) {
  return async (req, res, next) => {
    try {
      const identifier = req.body?.email || req.body?.username || 'anonymous';
      await rateLimit(req, limitType, identifier);
      next?.(); // Call next if available (for Express compatibility)
    } catch (err) {
      if (err.status === 429) {
        res.status(429).json({
          error: err.message,
          retryAfter: err.retryAfter
        });
      } else {
        throw err;
      }
    }
  };
}

export default rateLimit;
