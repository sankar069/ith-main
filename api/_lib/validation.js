/**
 * Input validation schemas using Zod
 * SECURITY: All API inputs must be validated before processing
 */

import { z } from 'zod';

/**
 * Common validation patterns
 */
const emailSchema = z.string().email('Invalid email address').max(255);
const uuidSchema = z.string().uuid('Invalid ID format');
const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format').min(1).max(100);
const urlSchema = z.string().url('Invalid URL').max(2048);
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional();

/**
 * Admin authentication schemas
 */
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(128)
});

export const adminChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character')
});

/**
 * Student registration/profile schemas
 */
export const studentRegistrationSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
  full_name: z.string().min(2).max(100),
  college: z.string().min(2).max(200).optional(),
  phone: phoneSchema
});

export const studentProfileUpdateSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  college: z.string().min(2).max(200).optional(),
  phone: phoneSchema,
  bio: z.string().max(1000).optional(),
  github_url: urlSchema.optional().or(z.literal('')),
  linkedin_url: urlSchema.optional().or(z.literal('')),
  portfolio_url: urlSchema.optional().or(z.literal(''))
});

/**
 * Event schemas
 */
export const eventCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: slugSchema,
  description: z.string().min(10).max(5000),
  event_type: z.enum(['workshop', 'hackathon', 'webinar', 'competition', 'networking', 'other']),
  category: z.string().min(2).max(100),
  start_date: z.string().datetime('Invalid start date'),
  end_date: z.string().datetime('Invalid end date'),
  registration_deadline: z.string().datetime('Invalid registration deadline').optional(),
  venue: z.string().min(2).max(200).optional(),
  venue_type: z.enum(['physical', 'virtual', 'hybrid']).default('physical'),
  max_participants: z.number().int().min(1).max(10000).optional(),
  registration_fee: z.number().min(0).max(1000000).default(0),
  banner_url: urlSchema.optional().or(z.literal('')),
  prerequisites: z.string().max(2000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional()
}).refine(data => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date']
});

export const eventUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: slugSchema.optional(),
  description: z.string().min(10).max(5000).optional(),
  event_type: z.enum(['workshop', 'hackathon', 'webinar', 'competition', 'networking', 'other']).optional(),
  category: z.string().min(2).max(100).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  registration_deadline: z.string().datetime().optional(),
  venue: z.string().min(2).max(200).optional(),
  venue_type: z.enum(['physical', 'virtual', 'hybrid']).optional(),
  max_participants: z.number().int().min(1).max(10000).optional(),
  registration_fee: z.number().min(0).max(1000000).optional(),
  banner_url: urlSchema.optional().or(z.literal('')),
  prerequisites: z.string().max(2000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional()
});

/**
 * Event registration schema
 */
export const eventRegistrationSchema = z.object({
  event_id: uuidSchema,
  student_id: uuidSchema,
  team_name: z.string().min(2).max(100).optional(),
  additional_info: z.string().max(1000).optional()
});

/**
 * File upload schemas
 */
export const fileUploadMetadataSchema = z.object({
  filename: z.string().min(1).max(255).regex(/^[a-zA-Z0-9._-]+$/, 'Invalid filename'),
  mimetype: z.string().regex(/^[a-z]+\/[a-z0-9.+-]+$/i, 'Invalid MIME type'),
  size: z.number().int().min(1).max(10 * 1024 * 1024), // 10MB max
  category: z.enum(['profile', 'event', 'certificate', 'project', 'document']).optional()
});

/**
 * Query parameter schemas
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export const idParamSchema = z.object({
  id: uuidSchema
});

export const slugParamSchema = z.object({
  slug: slugSchema
});

/**
 * CMS/Content schemas
 */
export const cmsPageSchema = z.object({
  page_key: z.string().min(1).max(100).regex(/^[a-z0-9-_]+$/, 'Invalid page key'),
  title: z.string().min(1).max(200),
  content_html: z.string().max(50000),
  meta_description: z.string().max(500).optional()
});

/**
 * User management schemas
 */
export const userFilterSchema = z.object({
  role: z.enum(['student', 'admin', 'event_manager']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  search: z.string().max(100).optional(),
  ...paginationSchema.shape
});

/**
 * Validation helper - validates and returns data or throws error
 */
export function validateInput(schema, data, errorPrefix = 'Validation error') {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors?.map?.(e => `${e.path.join('.')}: ${e.message}`)?.join('; ') || error.message;
      const validationError = new Error(`${errorPrefix}: ${errors}`);
      validationError.status = 400;
      validationError.validationErrors = error.errors;
      throw validationError;
    }
    throw error;
  }
}

/**
 * Safe validation - returns success/error object
 */
export function safeValidate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }))
  };
}

/**
 * Sanitize and validate together
 */
export function validateAndSanitize(schema, data) {
  const validated = validateInput(schema, data);
  
  // Additional sanitization for string fields
  const sanitized = {};
  for (const [key, value] of Object.entries(validated)) {
    if (typeof value === 'string') {
      // Trim whitespace
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

export default {
  validateInput,
  safeValidate,
  validateAndSanitize,
  // Export all schemas
  adminLoginSchema,
  adminChangePasswordSchema,
  studentRegistrationSchema,
  studentProfileUpdateSchema,
  eventCreateSchema,
  eventUpdateSchema,
  eventRegistrationSchema,
  fileUploadMetadataSchema,
  paginationSchema,
  idParamSchema,
  slugParamSchema,
  cmsPageSchema,
  userFilterSchema
};
