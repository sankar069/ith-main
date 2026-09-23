/**
 * JWT Security Tests
 * Validates JWT generation, verification, and security controls
 */

import { describe, it, expect, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock environment
process.env.ADMIN_JWT_SECRET = 'test-secret-for-testing-only-do-not-use-in-production';

// Import after setting env
import { signAdminToken, verifyAdminToken } from '../../api/_lib/auth.js';

describe('JWT Security', () => {
  describe('Token Generation', () => {
    it('should generate valid JWT with required claims', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include email claim', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = jwt.decode(token);
      
      expect(decoded.email).toBe('admin@test.com');
    });

    it('should include role claim', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'event_manager' });
      const decoded = jwt.decode(token);
      
      expect(decoded.role).toBe('event_manager');
    });

    it('should include issuer claim', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = jwt.decode(token);
      
      expect(decoded.iss).toBe('innotech-hub');
    });

    it('should include audience claim', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = jwt.decode(token);
      
      expect(decoded.aud).toBe('admin-console');
    });

    it('should include expiration claim', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = jwt.decode(token);
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should include issued-at timestamp', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = jwt.decode(token);
      
      expect(decoded.iat).toBeDefined();
      expect(decoded.iat).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));
    });

    it('should include unique JTI', () => {
      const token1 = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const token2 = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      
      const decoded1 = jwt.decode(token1);
      const decoded2 = jwt.decode(token2);
      
      expect(decoded1.jti).toBeDefined();
      expect(decoded2.jti).toBeDefined();
      expect(decoded1.jti).not.toBe(decoded2.jti); // Should be unique
    });
  });

  describe('Token Verification', () => {
    it('should verify valid token', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = verifyAdminToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.email).toBe('admin@test.com');
      expect(decoded.role).toBe('super_admin');
    });

    it('should reject token with invalid signature', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const tampered = token.slice(0, -5) + 'xxxxx'; // Corrupt signature
      
      expect(() => verifyAdminToken(tampered)).toThrow();
    });

    it('should reject token with wrong secret', () => {
      const wrongSecret = 'wrong-secret';
      const token = jwt.sign(
        { email: 'admin@test.com', role: 'super_admin' },
        wrongSecret,
        { algorithm: 'HS256' }
      );
      
      expect(() => verifyAdminToken(token)).toThrow();
    });

    it('should reject expired token', () => {
      // Clock tolerance is 30s, so need token expired by more than that
      const token = jwt.sign(
        {
          email: 'admin@test.com',
          role: 'super_admin',
          iss: 'innotech-hub',
          aud: 'admin-console',
        },
        process.env.ADMIN_JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '-1m' } // Expired 1 minute ago (beyond clock tolerance)
      );
      
      expect(() => verifyAdminToken(token)).toThrow();
    });

    it('should reject token with wrong algorithm', () => {
      // Try to create token with 'none' algorithm (attack vector)
      const token = jwt.sign(
        { email: 'admin@test.com', role: 'super_admin' },
        '',
        { algorithm: 'none' }
      );
      
      expect(() => verifyAdminToken(token)).toThrow();
    });

    it('should reject token with wrong issuer', () => {
      const token = jwt.sign(
        {
          email: 'admin@test.com',
          role: 'super_admin',
          iss: 'evil-issuer', // Wrong issuer
          aud: 'admin-console',
        },
        process.env.ADMIN_JWT_SECRET,
        { algorithm: 'HS256' }
      );
      
      expect(() => verifyAdminToken(token)).toThrow();
    });

    it('should reject token with wrong audience', () => {
      const token = jwt.sign(
        {
          email: 'admin@test.com',
          role: 'super_admin',
          iss: 'innotech-hub',
          aud: 'wrong-audience', // Wrong audience
        },
        process.env.ADMIN_JWT_SECRET,
        { algorithm: 'HS256' }
      );
      
      expect(() => verifyAdminToken(token)).toThrow();
    });

    it('should reject token with missing email', () => {
      const token = jwt.sign(
        {
          role: 'super_admin',
          iss: 'innotech-hub',
          aud: 'admin-console',
        },
        process.env.ADMIN_JWT_SECRET,
        { algorithm: 'HS256' }
      );
      
      expect(() => verifyAdminToken(token)).toThrow();
    });

    it('should reject token with invalid role', () => {
      const token = jwt.sign(
        {
          email: 'admin@test.com',
          role: 'hacker', // Invalid role
          iss: 'innotech-hub',
          aud: 'admin-console',
        },
        process.env.ADMIN_JWT_SECRET,
        { algorithm: 'HS256' }
      );
      
      expect(() => verifyAdminToken(token)).toThrow();
    });

    it('should reject malformed JWT', () => {
      expect(() => verifyAdminToken('not.a.jwt')).toThrow();
      expect(() => verifyAdminToken('invalid')).toThrow();
      expect(() => verifyAdminToken('')).toThrow();
      expect(() => verifyAdminToken(null)).toThrow();
    });
  });

  describe('Algorithm Security', () => {
    it('should use HS256 algorithm', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = jwt.decode(token, { complete: true });
      
      expect(decoded.header.alg).toBe('HS256');
    });

    it('should only accept HS256 algorithm', () => {
      // Try to create token with different algorithm
      // Note: RS256 requires key pair, so test with HS512 instead
      const token = jwt.sign(
        {
          email: 'attacker@evil.com',
          role: 'super_admin',
          iss: 'innotech-hub',
          aud: 'admin-console',
        },
        process.env.ADMIN_JWT_SECRET,
        { algorithm: 'HS512' } // Different algorithm
      );
      
      // Should reject because we only allow HS256
      expect(() => verifyAdminToken(token)).toThrow();
    });
  });

  describe('Token Expiration', () => {
    it('should set expiration to 12 hours', () => {
      const token = signAdminToken({ email: 'admin@test.com', role: 'super_admin' });
      const decoded = jwt.decode(token);
      
      const now = Math.floor(Date.now() / 1000);
      const twelveHours = 12 * 60 * 60;
      const expectedExpiry = now + twelveHours;
      
      // Allow 10 second tolerance
      expect(decoded.exp).toBeGreaterThanOrEqual(expectedExpiry - 10);
      expect(decoded.exp).toBeLessThanOrEqual(expectedExpiry + 10);
    });
  });
});
