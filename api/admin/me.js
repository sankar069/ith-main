import { withAdminHandler, requireAdminAuth, sendJson } from '../_lib/auth.js';

// Lightweight session check — the admin shell calls this on load to verify
// a stored token is still valid before trusting it, and to know the role
// (Super Admin gate) without re-decoding the JWT on the client.
export default withAdminHandler(['GET'], async (req, res) => {
  const payload = requireAdminAuth(req);
  sendJson(res, 200, { admin: { email: payload.email, role: payload.role } });
});
