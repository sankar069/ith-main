/**
 * Audit logging system for security-sensitive operations
 * SECURITY: Never log passwords, tokens, or secrets
 */

import { getSupabaseAdmin } from './supabaseAdmin.js';

/**
 * Audit event types
 */
export const AUDIT_EVENTS = {
  // Authentication
  ADMIN_LOGIN_SUCCESS: 'admin.login.success',
  ADMIN_LOGIN_FAILED: 'admin.login.failed',
  ADMIN_LOGOUT: 'admin.logout',
  STUDENT_LOGIN_SUCCESS: 'student.login.success',
  STUDENT_LOGIN_FAILED: 'student.login.failed',
  STUDENT_LOGOUT: 'student.logout',
  
  // Authorization
  UNAUTHORIZED_ACCESS: 'auth.unauthorized',
  PERMISSION_DENIED: 'auth.permission_denied',
  
  // Admin Actions
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  EVENT_CREATED: 'event.created',
  EVENT_UPDATED: 'event.updated',
  EVENT_DELETED: 'event.deleted',
  
  // Registrations
  REGISTRATION_CREATED: 'registration.created',
  REGISTRATION_APPROVED: 'registration.approved',
  REGISTRATION_REJECTED: 'registration.rejected',
  
  // Security
  RATE_LIMIT_EXCEEDED: 'security.rate_limit_exceeded',
  FILE_UPLOAD_REJECTED: 'security.file_upload_rejected',
  XSS_ATTEMPT_BLOCKED: 'security.xss_blocked',
  
  // Admin Privileges
  PASSWORD_CHANGED: 'admin.password_changed',
  SETTINGS_UPDATED: 'admin.settings_updated',
};

/**
 * Log an audit event
 * @param {Object} event - Audit event details
 * @param {string} event.action - Action type from AUDIT_EVENTS
 * @param {string} event.actorEmail - Email of user performing action
 * @param {string} event.actorRole - Role of user (admin, student, etc.)
 * @param {string} event.targetResource - Resource being acted upon (user ID, event ID, etc.)
 * @param {string} event.targetType - Type of resource (user, event, registration, etc.)
 * @param {boolean} event.success - Whether action succeeded
 * @param {Object} event.metadata - Additional context (safe data only)
 * @param {string} event.ipAddress - IP address of request
 * @param {string} event.userAgent - User agent string
 */
export async function logAuditEvent(event) {
  try {
    const supabase = getSupabaseAdmin();
    
    // Sanitize metadata - remove any potential secrets
    const safeMetadata = sanitizeMetadata(event.metadata || {});
    
    const auditRecord = {
      action: event.action,
      actor_email: event.actorEmail || 'anonymous',
      actor_role: event.actorRole || 'unknown',
      target_resource: event.targetResource || null,
      target_type: event.targetType || null,
      success: event.success !== false, // Default to true
      metadata: safeMetadata,
      ip_address: event.ipAddress || null,
      user_agent: event.userAgent ? truncate(event.userAgent, 500) : null,
      created_at: new Date().toISOString(),
    };
    
    // Insert audit log
    const { error } = await supabase
      .from('audit_logs')
      .insert(auditRecord);
    
    if (error) {
      // Don't throw - audit logging shouldn't break application flow
      console.error('[AUDIT] Failed to log event:', error.message);
    }
  } catch (err) {
    // Silent fail - audit logging shouldn't break application
    console.error('[AUDIT] Exception:', err.message);
  }
}

/**
 * Sanitize metadata to remove sensitive information
 */
function sanitizeMetadata(metadata) {
  const dangerous = [
    'password',
    'token',
    'secret',
    'key',
    'jwt',
    'authorization',
    'cookie',
    'session',
    'credential',
  ];
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    const lowercaseKey = key.toLowerCase();
    
    // Skip dangerous keys
    if (dangerous.some(d => lowercaseKey.includes(d))) {
      sanitized[key] = '[REDACTED]';
      continue;
    }
    
    // Truncate long strings
    if (typeof value === 'string' && value.length > 1000) {
      sanitized[key] = truncate(value, 1000);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Truncate string to max length
 */
function truncate(str, maxLength) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '... [truncated]';
}

/**
 * Extract IP address from request
 */
export function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Create audit log for authentication events
 */
export function logAuth(req, event, email, success, metadata = {}) {
  return logAuditEvent({
    action: event,
    actorEmail: email,
    actorRole: event.includes('admin') ? 'admin' : 'student',
    success,
    metadata,
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent'],
  });
}

/**
 * Create audit log for admin actions
 */
export function logAdminAction(req, admin, event, targetResource, targetType, success = true, metadata = {}) {
  return logAuditEvent({
    action: event,
    actorEmail: admin.email,
    actorRole: admin.role || 'admin',
    targetResource,
    targetType,
    success,
    metadata,
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent'],
  });
}

/**
 * Create audit log for security events
 */
export function logSecurityEvent(req, event, metadata = {}) {
  return logAuditEvent({
    action: event,
    actorEmail: metadata.email || 'unknown',
    actorRole: 'system',
    success: false, // Security events are usually failures
    metadata,
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent'],
  });
}

export default {
  logAuditEvent,
  logAuth,
  logAdminAction,
  logSecurityEvent,
  AUDIT_EVENTS,
  getClientIP,
};
