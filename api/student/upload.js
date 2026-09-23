import { formidable } from 'formidable';
import fs from 'node:fs';
import path from 'node:path';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { withApiHandler, sendJson, AuthError } from '../_lib/auth.js';
import { requireStudentAuth } from './_lib/studentAuth.js';
import { validateUploadedFile, sanitizeFilename } from '../_lib/fileValidation.js';

// Vercel's default JSON/urlencoded body parser must stay OFF for this route
// so we can read the raw multipart stream ourselves via formidable.
export const config = {
  api: { bodyParser: false },
};

// Students may only ever upload payment proof — everything else (banners,
// rules docs, etc.) goes through the admin-only /api/admin/upload.
const FOLDER_CONFIG = {
  'payment-proof': { bucket: 'event-docs', maxSizeMb: 5, accept: ['image/', 'application/pdf'] },
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

export default withApiHandler(['POST'], async (req, res) => {
  const { profile } = await requireStudentAuth(req);

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
  
  // SECURITY: Sanitize filename and generate safe unique name linked to student
  const sanitizedOriginal = sanitizeFilename(fileEntry.originalFilename || 'file');
  const safeName = `${folder}-${profile.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  const supabase = getSupabaseAdmin();
  const { error: uploadError } = await supabase.storage
    .from(folderConfig.bucket)
    .upload(safeName, buffer, { contentType: fileEntry.mimetype || 'application/octet-stream', upsert: false });

  if (uploadError) throw new AuthError(uploadError.message, 500);

  const { data: publicUrlData } = supabase.storage.from(folderConfig.bucket).getPublicUrl(safeName);

  sendJson(res, 201, { url: publicUrlData.publicUrl, path: safeName, bucket: folderConfig.bucket });
});
