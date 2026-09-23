import { hashPassword, verifyPassword } from './password.js';

// Bootstrap fallback for the original seeded super admin only — lets login
// keep working via the spec's hardcoded (or env-overridden) credential until
// a real password is set for that account via Settings -> Change Password.
const LEGACY_ADMIN_EMAIL = 'ithadmin@ith.com';
const LEGACY_ADMIN_PASSWORD = 'admin@2026';

function legacyEmail() {
  return (process.env.ADMIN_EMAIL || LEGACY_ADMIN_EMAIL).trim().toLowerCase();
}

function legacyPassword() {
  return process.env.ADMIN_PASSWORD || LEGACY_ADMIN_PASSWORD;
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

/** Returns the admins row on success, or null on invalid credentials. */
export async function authenticateAdmin(supabase, email, password) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) return null;

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error || !admin || admin.status !== 'active') return null;

  if (admin.password_hash) {
    return verifyPassword(password, admin.password_hash) ? admin : null;
  }

  // No password set yet — only reachable for the seeded super admin email.
  if (normalizedEmail === legacyEmail() && password === legacyPassword()) {
    return admin;
  }
  return null;
}

/** Throws with a user-facing message on failure; resolves on success. */
export async function changeAdminPassword(supabase, email, currentPassword, newPassword) {
  const normalizedEmail = normalizeEmail(email);

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error || !admin) {
    const err = new Error('Admin account not found.');
    err.status = 404;
    throw err;
  }

  const currentValid = admin.password_hash
    ? verifyPassword(currentPassword, admin.password_hash)
    : normalizedEmail === legacyEmail() && currentPassword === legacyPassword();

  if (!currentValid) {
    const err = new Error('Current password is incorrect.');
    err.status = 401;
    throw err;
  }

  if (!newPassword || newPassword.length < 8) {
    const err = new Error('New password must be at least 8 characters.');
    err.status = 422;
    throw err;
  }

  const newHash = hashPassword(newPassword);
  const { error: updateError } = await supabase
    .from('admins')
    .update({ password_hash: newHash })
    .eq('email', normalizedEmail);

  if (updateError) {
    const err = new Error(updateError.message);
    err.status = 500;
    throw err;
  }
}
