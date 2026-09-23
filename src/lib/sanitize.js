import DOMPurify from 'isomorphic-dompurify';

/**
 * Centralized HTML sanitization utility
 * Prevents XSS attacks by allowing only safe HTML elements and attributes
 */

// Configuration for different content types
const SANITIZE_CONFIGS = {
  // For rich text content (legal pages, event descriptions)
  richText: {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
    // Only allow safe protocols
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Prevent malicious link attributes
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    // Enforce safe link behavior
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'style'],
  },
  
  // For basic text with minimal formatting
  basic: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  },
  
  // For user comments/descriptions
  userContent: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'style', 'link'],
  }
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Unsanitized HTML string
 * @param {string} profile - Sanitization profile ('richText', 'basic', 'userContent')
 * @returns {string} - Sanitized HTML safe for rendering
 */
export function sanitizeHTML(dirty, profile = 'richText') {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const config = SANITIZE_CONFIGS[profile] || SANITIZE_CONFIGS.richText;
  
  // Configure DOMPurify
  const clean = DOMPurify.sanitize(dirty, {
    ...config,
    // Return cleaned string, not DOM
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    // Ensure we're returning trusted content
    RETURN_TRUSTED_TYPE: false,
    // Sanitize in place
    IN_PLACE: false,
    // Force body context
    FORCE_BODY: true,
    // Keep HTML intact but safe
    KEEP_CONTENT: true,
    // Safe defaults
    SAFE_FOR_TEMPLATES: true,
    SAFE_FOR_XML: false,
  });

  return clean;
}

/**
 * Sanitize plain text - removes all HTML
 * @param {string} text - Text that might contain HTML
 * @returns {string} - Plain text with HTML stripped
 */
export function sanitizePlainText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize URL to prevent javascript: and data: schemes
 * @param {string} url - URL to sanitize
 * @returns {string} - Safe URL or empty string
 */
export function sanitizeURL(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove whitespace
  url = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(url)) {
    return '';
  }

  // Allow only safe protocols
  const safeProtocols = /^(https?|mailto|tel):/i;
  const isRelative = url.startsWith('/') || url.startsWith('#') || url.startsWith('?');
  
  if (!isRelative && !safeProtocols.test(url)) {
    return '';
  }

  return DOMPurify.sanitize(url, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
}

/**
 * Create a safe React component prop for dangerouslySetInnerHTML
 * @param {string} html - HTML to sanitize
 * @param {string} profile - Sanitization profile
 * @returns {object} - Safe prop object for React
 */
export function createSafeHTML(html, profile = 'richText') {
  return {
    __html: sanitizeHTML(html, profile)
  };
}

// Re-export DOMPurify for advanced use cases
export { DOMPurify };
