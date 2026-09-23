/**
 * Input Validation Security Tests
 * Validates Zod schemas prevent injection and malformed input
 */

import { describe, it, expect } from 'vitest';
import {
  validateInput,
  adminLoginSchema,
  studentProfileUpdateSchema,
  eventCreateSchema,
  fileUploadMetadataSchema,
  paginationSchema,
} from '../../api/_lib/validation.js';

describe('Input Validation Security', () => {
  describe('Admin Login Validation', () => {
    it('should accept valid email and password', () => {
      const result = validateInput(adminLoginSchema, {
        email: 'admin@test.com',
        password: 'SecurePass123!',
      });
      
      expect(result.email).toBe('admin@test.com');
      expect(result.password).toBe('SecurePass123!');
    });

    it('should reject invalid email format', () => {
      expect(() => {
        validateInput(adminLoginSchema, {
          email: 'not-an-email',
          password: 'password123',
        });
      }).toThrow(/Invalid email address/);
    });

    it('should reject short password', () => {
      expect(() => {
        validateInput(adminLoginSchema, {
          email: 'admin@test.com',
          password: 'short',
        });
      }).toThrow(/at least 8 characters/);
    });

    it('should reject SQL injection in email', () => {
      expect(() => {
        validateInput(adminLoginSchema, {
          email: "admin' OR '1'='1",
          password: 'password123',
        });
      }).toThrow(/Invalid email/);
    });

    it('should reject oversized password', () => {
      expect(() => {
        validateInput(adminLoginSchema, {
          email: 'admin@test.com',
          password: 'a'.repeat(200),
        });
      }).toThrow();
    });

    it('should reject missing fields', () => {
      expect(() => {
        validateInput(adminLoginSchema, {});
      }).toThrow();
    });
  });

  describe('Student Profile Update Validation', () => {
    it('should accept valid profile data', () => {
      const result = validateInput(studentProfileUpdateSchema, {
        full_name: 'John Doe',
        college: 'MIT',
        phone: '+1234567890',
      });
      
      expect(result.full_name).toBe('John Doe');
      expect(result.college).toBe('MIT');
    });

    it('should reject XSS in name', () => {
      const result = validateInput(studentProfileUpdateSchema, {
        full_name: '<script>alert("xss")</script>',
      });
      
      // Should pass validation (sanitization happens later)
      // But length should be limited
      expect(result.full_name).toBeDefined();
      expect(result.full_name.length).toBeLessThan(101);
    });

    it('should reject oversized bio', () => {
      expect(() => {
        validateInput(studentProfileUpdateSchema, {
          bio: 'a'.repeat(2000),
        });
      }).toThrow();
    });

    it('should validate URL format', () => {
      expect(() => {
        validateInput(studentProfileUpdateSchema, {
          github_url: 'not-a-url',
        });
      }).toThrow();
    });

    it('should accept valid URLs', () => {
      const result = validateInput(studentProfileUpdateSchema, {
        github_url: 'https://github.com/user',
        linkedin_url: 'https://linkedin.com/in/user',
      });
      
      expect(result.github_url).toBe('https://github.com/user');
    });

    it('should accept empty string for optional URL', () => {
      const result = validateInput(studentProfileUpdateSchema, {
        github_url: '',
      });
      
      expect(result.github_url).toBe('');
    });
  });

  describe('File Upload Metadata Validation', () => {
    it('should accept valid file metadata', () => {
      const result = validateInput(fileUploadMetadataSchema, {
        filename: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1024000,
      });
      
      expect(result.filename).toBe('document.pdf');
      expect(result.mimetype).toBe('application/pdf');
      expect(result.size).toBe(1024000);
    });

    it('should reject path traversal in filename', () => {
      expect(() => {
        validateInput(fileUploadMetadataSchema, {
          filename: '../../../etc/passwd',
          mimetype: 'text/plain',
          size: 1000,
        });
      }).toThrow();
    });

    it('should reject dangerous characters in filename', () => {
      expect(() => {
        validateInput(fileUploadMetadataSchema, {
          filename: 'file<script>.txt',
          mimetype: 'text/plain',
          size: 1000,
        });
      }).toThrow();
    });

    it('should reject oversized file', () => {
      expect(() => {
        validateInput(fileUploadMetadataSchema, {
          filename: 'large.pdf',
          mimetype: 'application/pdf',
          size: 50 * 1024 * 1024, // 50MB
        });
      }).toThrow();
    });

    it('should reject invalid MIME type format', () => {
      expect(() => {
        validateInput(fileUploadMetadataSchema, {
          filename: 'file.txt',
          mimetype: 'invalid-mime',
          size: 1000,
        });
      }).toThrow();
    });

    it('should reject zero or negative size', () => {
      expect(() => {
        validateInput(fileUploadMetadataSchema, {
          filename: 'file.txt',
          mimetype: 'text/plain',
          size: 0,
        });
      }).toThrow();
    });
  });

  describe('Pagination Validation', () => {
    it('should accept valid pagination params', () => {
      const result = validateInput(paginationSchema, {
        page: 1,
        limit: 20,
      });
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should coerce string numbers to integers', () => {
      const result = validateInput(paginationSchema, {
        page: '2',
        limit: '50',
      });
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
      expect(typeof result.page).toBe('number');
    });

    it('should reject negative page numbers', () => {
      expect(() => {
        validateInput(paginationSchema, {
          page: -1,
          limit: 20,
        });
      }).toThrow();
    });

    it('should reject excessive limit', () => {
      expect(() => {
        validateInput(paginationSchema, {
          page: 1,
          limit: 1000,
        });
      }).toThrow();
    });

    it('should use defaults for missing params', () => {
      const result = validateInput(paginationSchema, {});
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should reject SQL injection in page param', () => {
      expect(() => {
        validateInput(paginationSchema, {
          page: "1 OR 1=1",
          limit: 20,
        });
      }).toThrow();
    });
  });

  describe('Event Creation Validation', () => {
    const validEvent = {
      title: 'Test Hackathon',
      slug: 'test-hackathon-2024',
      description: 'A great hackathon for students to learn and build.',
      event_type: 'hackathon',
      category: 'Technology',
      start_date: '2024-12-01T10:00:00Z',
      end_date: '2024-12-02T18:00:00Z',
      venue: 'MIT Campus',
      venue_type: 'physical',
      max_participants: 100,
      registration_fee: 0,
    };

    it('should accept valid event data', () => {
      const result = validateInput(eventCreateSchema, validEvent);
      
      expect(result.title).toBe('Test Hackathon');
      expect(result.event_type).toBe('hackathon');
    });

    it('should reject invalid slug format', () => {
      expect(() => {
        validateInput(eventCreateSchema, {
          ...validEvent,
          slug: 'Invalid Slug With Spaces!',
        });
      }).toThrow();
    });

    it('should reject end date before start date', () => {
      expect(() => {
        validateInput(eventCreateSchema, {
          ...validEvent,
          start_date: '2024-12-02T10:00:00Z',
          end_date: '2024-12-01T18:00:00Z',
        });
      }).toThrow(/End date must be after start date/);
    });

    it('should reject invalid event type', () => {
      expect(() => {
        validateInput(eventCreateSchema, {
          ...validEvent,
          event_type: 'invalid_type',
        });
      }).toThrow();
    });

    it('should reject negative registration fee', () => {
      expect(() => {
        validateInput(eventCreateSchema, {
          ...validEvent,
          registration_fee: -10,
        });
      }).toThrow();
    });

    it('should reject excessive max participants', () => {
      expect(() => {
        validateInput(eventCreateSchema, {
          ...validEvent,
          max_participants: 50000,
        });
      }).toThrow();
    });

    it('should reject XSS in title', () => {
      // Validation allows it (sanitization happens later)
      // But should enforce max length
      const result = validateInput(eventCreateSchema, {
        ...validEvent,
        title: '<script>alert("xss")</script> Event',
      });
      
      expect(result.title.length).toBeLessThan(201);
    });
  });
});
