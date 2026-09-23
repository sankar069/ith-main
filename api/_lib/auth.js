import jwt from 'jsonwebtoken';

const TOKEN_TTL = '12h';
const ALGORITHM = 'HS256'; // Explicit algorithm to prevent algorithm confusion attacks

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error('Missing ADMIN_JWT_SECRET environment variable. See ADMIN_SETUP.md.');
  }
  // Validate secret strength in development
  if (process.env.NODE_ENV !== 'production' && secret.length < 32) {
    console.warn('⚠️  WARNING: ADMIN_JWT_SECRET should be at least 32 characters (64 recommended)');
  }
  return secret;
}

export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.status = status;
  }
}

export function signAdminToken({ email, role = 'super_admin' }) {
  return jwt.sign(
    { 
      email, 
      role,
      iat: Math.floor(Date.now() / 1000), // Issued at
      jti: `${email}-${Date.now()}-${Math.random()}` // Unique token ID
    }, 
    getJwtSecret(), 
    { 
      expiresIn: TOKEN_TTL,
      algorithm: ALGORITHM,
      issuer: 'innotech-hub',
      audience: 'admin-console'
    }
  );
}

export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: [ALGORITHM], // Prevent algorithm confusion
      issuer: 'innotech-hub',
      audience: 'admin-console',
      clockTolerance: 30 // Allow 30s clock skew
    });
    
    // Validate required claims
    if (!decoded.email || typeof decoded.email !== 'string') {
      throw new Error('Invalid token: missing email claim');
    }
    if (!decoded.role || typeof decoded.role !== 'string') {
      throw new Error('Invalid token: missing role claim');
    }
    if (!['super_admin', 'event_manager'].includes(decoded.role)) {
      throw new Error('Invalid token: invalid role value');
    }
    
    return decoded;
  } catch (err) {
    // Generic error message to avoid information leakage
    if (err.name === 'TokenExpiredError') {
      throw new AuthError('Session expired. Please log in again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      throw new AuthError('Invalid session. Please log in again.', 401);
    }
    throw new AuthError('Authentication failed. Please log in again.', 401);
  }
}

// Call at the top of any protected /api/admin/** handler.
// Returns the decoded token payload ({ email, role }) or throws AuthError.
export function requireAdminAuth(req) {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AuthError('Missing admin session token.', 401);
  }
  const token = header.slice('Bearer '.length).trim();
  return verifyAdminToken(token);
}

// Call inside a handler for actions restricted to Super Admin
// (e.g. Delete User, Delete Event).
export function requireSuperAdmin(payload) {
  if (payload?.role !== 'super_admin') {
    throw new AuthError('This action requires Super Admin privileges.', 403);
  }
}

export function sendJson(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
}

export function sendError(res, err) {
  const status = err instanceof AuthError ? err.status : (err.status || 500);
  const message = err.message || 'Internal server error';
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  sendJson(res, status, { error: message });
}

// Wraps a handler with CORS + method guard + centralized error handling
// so every endpoint doesn't repeat this boilerplate.
export function withAdminHandler(allowedMethods, handler) {
  return async (req, res) => {
    // SECURITY: Explicit CORS origins - NO WILDCARD
    const ALLOWED_ORIGINS = [
      'https://innotech-hub.vercel.app',
      'https://innotech-hub-ith.vercel.app',
      // Development origins only in development
      ...(process.env.NODE_ENV === 'development' ? [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173', // Vite preview
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
      ] : [])
    ];

    const origin = req.headers.origin || req.headers.referer?.split('/')[2];
    
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (process.env.NODE_ENV === 'production' && origin) {
      // In production, reject unknown origins
      return sendJson(res, 403, { error: 'Origin not allowed' });
    } else if (process.env.NODE_ENV === 'development') {
      // In development, log and allow for easier testing
      console.warn(`⚠️  CORS: Allowing origin in development: ${origin || 'unknown'}`);
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Methods', [...allowedMethods, 'OPTIONS'].join(', '));
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    if (!allowedMethods.includes(req.method)) {
      sendJson(res, 405, { error: `Method ${req.method} not allowed.` });
      return;
    }

    try {
      await handler(req, res);
    } catch (err) {
      sendError(res, err);
    }
  };
}

// Same wrapper, generic name — used by /api/student/** handlers so the
// import doesn't read as admin-specific even though the implementation is.
export const withApiHandler = withAdminHandler;
