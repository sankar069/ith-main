import crypto from 'node:crypto';

// Salted scrypt hashing using only Node's built-in crypto module — no
// external dependency (bcrypt/argon2) needed, which also means there's
// nothing to install that could fail to resolve in a constrained build.
const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(plain, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hashHex] = stored.split(':');
  if (!salt || !hashHex) return false;

  const hash = crypto.scryptSync(plain, salt, KEY_LENGTH);
  const storedBuf = Buffer.from(hashHex, 'hex');
  if (hash.length !== storedBuf.length) return false;

  return crypto.timingSafeEqual(hash, storedBuf);
}
