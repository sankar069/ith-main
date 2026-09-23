/**
 * File validation utilities for secure file uploads
 * SECURITY: Validates file types using magic bytes (file signatures)
 */

import fs from 'node:fs';

/**
 * File magic bytes signatures for validation
 * First few bytes of common file types
 */
const FILE_SIGNATURES = {
  // Images
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF], // JPEG
  ],
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50], // RIFF....WEBP
  ],
  'image/svg+xml': [
    [0x3C, 0x3F, 0x78, 0x6D, 0x6C], // <?xml
    [0x3C, 0x73, 0x76, 0x67], // <svg
  ],
  
  // Documents
  'application/pdf': [
    [0x25, 0x50, 0x44, 0x46, 0x2D], // %PDF-
  ],
  'application/zip': [
    [0x50, 0x4B, 0x03, 0x04], // ZIP / DOCX / XLSX / PPTX
    [0x50, 0x4B, 0x05, 0x06], // Empty ZIP archive
    [0x50, 0x4B, 0x07, 0x08], // Spanned ZIP
  ],
  // MS Office (old format)
  'application/msword': [
    [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // DOC, XLS, PPT
  ],
};

/**
 * Validate file signature (magic bytes) against expected MIME type
 * @param {Buffer} buffer - File buffer to validate
 * @param {string} expectedMimeType - Expected MIME type
 * @returns {boolean} - True if signature matches
 */
export function validateFileSignature(buffer, expectedMimeType) {
  if (!buffer || buffer.length < 12) {
    return false; // File too small to validate
  }

  // Allow prefixes (e.g., 'image/' matches 'image/jpeg', 'image/png', etc.)
  const mimePrefix = expectedMimeType.endsWith('/') ? expectedMimeType : null;
  
  // Find all matching MIME types
  const matchingTypes = Object.keys(FILE_SIGNATURES).filter(mimeType => {
    if (mimePrefix) {
      return mimeType.startsWith(mimePrefix);
    }
    return mimeType === expectedMimeType;
  });

  if (matchingTypes.length === 0) {
    console.warn(`No file signature defined for MIME type: ${expectedMimeType}`);
    return true; // Allow if no signature defined (fallback)
  }

  // Check if buffer matches any known signature for these MIME types
  for (const mimeType of matchingTypes) {
    const signatures = FILE_SIGNATURES[mimeType];
    for (const signature of signatures) {
      if (matchesSignature(buffer, signature)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if buffer matches a specific signature pattern
 * @param {Buffer} buffer - File buffer
 * @param {Array} signature - Signature pattern (null = wildcard byte)
 * @returns {boolean}
 */
function matchesSignature(buffer, signature) {
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] === null) {
      continue; // Wildcard byte - skip
    }
    if (buffer[i] !== signature[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Sanitize filename - remove dangerous characters
 * @param {string} filename - Original filename
 * @returns {string} - Safe filename
 */
export function sanitizeFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    return 'file';
  }

  // Remove path separators and dangerous characters
  let safe = filename
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove Windows forbidden characters
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();

  // Ensure filename isn't empty
  if (!safe) {
    safe = 'file';
  }

  // Limit length
  if (safe.length > 255) {
    const ext = safe.slice(safe.lastIndexOf('.'));
    safe = safe.slice(0, 255 - ext.length) + ext;
  }

  return safe;
}

/**
 * Validate file extension against allowed list
 * @param {string} filename - Filename to check
 * @param {Array<string>} allowedExtensions - Allowed extensions (e.g., ['.jpg', '.png'])
 * @returns {boolean}
 */
export function validateFileExtension(filename, allowedExtensions) {
  if (!filename || !allowedExtensions || allowedExtensions.length === 0) {
    return false;
  }

  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return allowedExtensions.map(e => e.toLowerCase()).includes(ext);
}

/**
 * Get allowed extensions for MIME type prefix
 * @param {string} mimePrefix - MIME prefix (e.g., 'image/')
 * @returns {Array<string>} - Allowed extensions
 */
export function getAllowedExtensions(mimePrefix) {
  const extensions = {
    'image/': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd': ['.docx', '.xlsx', '.pptx'],
  };

  for (const [key, exts] of Object.entries(extensions)) {
    if (mimePrefix.startsWith(key)) {
      return exts;
    }
  }

  return [];
}

/**
 * Comprehensive file validation
 * @param {Object} file - File object from formidable
 * @param {Object} config - Validation config
 * @returns {Object} - { valid: boolean, error?: string }
 */
export async function validateUploadedFile(file, config) {
  const { maxSizeMb, accept } = config;

  // 1. Size validation
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > maxSizeMb) {
    return {
      valid: false,
      error: `File size (${sizeMb.toFixed(2)}MB) exceeds limit of ${maxSizeMb}MB`
    };
  }

  // 2. MIME type validation (client-provided, not fully trusted)
  const mimetype = file.mimetype || '';
  const mimeAllowed = accept.some(prefix => mimetype.startsWith(prefix));
  if (!mimeAllowed) {
    return {
      valid: false,
      error: `File type "${mimetype}" not allowed. Allowed: ${accept.join(', ')}`
    };
  }

  // 3. Extension validation
  const allowedExts = accept.flatMap(getAllowedExtensions);
  if (allowedExts.length > 0 && !validateFileExtension(file.originalFilename, allowedExts)) {
    return {
      valid: false,
      error: `File extension not allowed. Allowed: ${allowedExts.join(', ')}`
    };
  }

  // 4. Magic byte validation (read file signature)
  try {
    const buffer = await fs.promises.readFile(file.filepath);
    
    // Check signature for each accepted MIME type
    let signatureValid = false;
    for (const acceptedMime of accept) {
      if (validateFileSignature(buffer, acceptedMime)) {
        signatureValid = true;
        break;
      }
    }

    if (!signatureValid) {
      return {
        valid: false,
        error: 'File content does not match declared type (magic byte validation failed)'
      };
    }

    // SVG-specific checks (prevent XXE and script injection)
    if (mimetype === 'image/svg+xml' || file.originalFilename?.toLowerCase().endsWith('.svg')) {
      const svgContent = buffer.toString('utf8');
      
      // Block dangerous SVG elements
      const dangerousPatterns = [
        /<script/i,
        /on\w+\s*=/i, // Event handlers
        /javascript:/i,
        /<foreignObject/i,
        /<embed/i,
        /<object/i,
        /<iframe/i,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(svgContent)) {
          return {
            valid: false,
            error: 'SVG contains potentially dangerous content'
          };
        }
      }
    }

  } catch (error) {
    return {
      valid: false,
      error: `Failed to validate file: ${error.message}`
    };
  }

  return { valid: true };
}

export default {
  validateFileSignature,
  sanitizeFilename,
  validateFileExtension,
  getAllowedExtensions,
  validateUploadedFile
};
