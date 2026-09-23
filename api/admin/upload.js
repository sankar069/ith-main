import { formidable } from 'formidable';
import fs from 'node:fs';
import path from 'node:path';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withAdminHandler, requireAdminAuth, sendJson, AuthError } from '../_lib/auth.js';
import { validateUploadedFile, sanitizeFilename } from '../_lib/fileValidation.js';

// Vercel's default JSON/urlencoded body parser must stay OFF for this route
// so we can read the raw multipart stream ourselves via formidable.
export const config = {
  api: { bodyParser: false },
};

// folder -> { bucket, maxSizeMb, accept }
const FOLDER_CONFIG = {
  banner: { bucket: 'event-media', maxSizeMb: 5, accept: ['image/'] },
  gallery: { bucket: 'event-media', maxSizeMb: 5, accept: ['image/'] },
  rules: { bucket: 'event-docs', maxSizeMb: 10, accept: ['application/pdf', 'image/', 'application/msword', 'application/vnd'] },
  certificate: { bucket: 'event-docs', maxSizeMb: 10, accept: ['application/pdf', 'image/'] },
  'sponsor-logo': { bucket: 'cms-media', maxSizeMb: 3, accept: ['image/'] },
  'promo-banner': { bucket: 'cms-media', maxSizeMb: 5, accept: ['image/'] },
  avatar: { bucket: 'cms-media', maxSizeMb: 3, accept: ['image/'] },
};

function parseForm(req) {
  const form = formidable({ maxFileSize: 10 * 1024 * 1024, multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default withAdminHandler(['POST'], async (req, res) => {
  requireAdminAuth(req);

  const { fields, files } = await parseForm(req);
  const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;
  const fileEntry = Array.isArray(files.file) ? files.file[0] : files.file;

  if (!fileEntry) throw new AuthError('No file was uploaded.', 400);

  const folderConfig = FOLDER_CONFIG[folder];
  if (!folderConfig) {
    throw new AuthError(`Unknown upload folder "${folder}". Expected one of: ${Object.keys(FOLDER_CONFIG).join(', ')}.`, 400);
  }

  // SECURITY: Comprehensive file validation (size, MIME, extension, magic bytes)
  const validation = await validateUploadedFile(fileEntry, folderConfig);
  if (!validation.valid) {
    throw new AuthError(validation.error, 400);
  }

  const buffer = await fs.promises.readFile(fileEntry.filepath);
  const ext = path.extname(fileEntry.originalFilename || '') || '';
  
  // SECURITY: Sanitize filename and generate safe unique name
  const sanitizedOriginal = sanitizeFilename(fileEntry.originalFilename || 'file');
  const safeName = `${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  const supabase = getSupabaseAdmin();
  const { error: uploadError } = await supabase.storage
    .from(folderConfig.bucket)
    .upload(safeName, buffer, { contentType: fileEntry.mimetype || 'application/octet-stream', upsert: false });

  if (uploadError) throw new AuthError(uploadError.message, 500);

  const { data: publicUrlData } = supabase.storage.from(folderConfig.bucket).getPublicUrl(safeName);

  sendJson(res, 201, { url: publicUrlData.publicUrl, path: safeName, bucket: folderConfig.bucket });
});
