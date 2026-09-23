import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withAdminHandler, signAdminToken, sendJson, AuthError } from '../_lib/auth.js';
import { authenticateAdmin } from '../_lib/adminAuth.js';
import { rateLimit, resetRateLimit } from '../_lib/rateLimit.js';
import { validateInput, adminLoginSchema } from '../_lib/validation.js';
import { logAuth, logSecurityEvent, AUDIT_EVENTS } from '../_lib/auditLog.js';

export default withAdminHandler(['POST'], async (req, res) => {
  let email;
  
  try {
    // SECURITY: Validate input structure and types
    const validated = validateInput(adminLoginSchema, req.body || {});
    email = validated.email;

    // SECURITY: Rate limiting - 5 attempts per 15 minutes per IP+email
    try {
      await rateLimit(req, 'auth:login', email.toLowerCase().trim());
    } catch (err) {
      if (err.status === 429) {
        // Log rate limit violation
        await logSecurityEvent(req, AUDIT_EVENTS.RATE_LIMIT_EXCEEDED, {
          email: email.toLowerCase().trim(),
          endpoint: '/api/admin/login',
        });
        throw new AuthError(err.message, 429);
      }
      throw err;
    }

    const supabase = getSupabaseAdmin();
    const admin = await authenticateAdmin(supabase, email, validated.password);

    if (!admin) {
      // Log failed login attempt
      await logAuth(req, AUDIT_EVENTS.ADMIN_LOGIN_FAILED, email, false);
      
      // SECURITY: Generic error message to prevent account enumeration
      throw new AuthError('Invalid credentials.', 401);
    }

    // SECURITY: Reset rate limit on successful authentication
    resetRateLimit(req, 'auth:login', email.toLowerCase().trim());

    // Log successful login
    await logAuth(req, AUDIT_EVENTS.ADMIN_LOGIN_SUCCESS, admin.email, true, {
      role: admin.role,
    });

    const token = signAdminToken({ email: admin.email, role: admin.role });

    sendJson(res, 200, {
      token,
      admin: {
        email: admin.email,
        role: admin.role,
        display_name: admin.display_name,
        avatar_url: admin.avatar_url,
      },
    });
  } catch (err) {
    // Rethrow after logging
    throw err;
  }
});
