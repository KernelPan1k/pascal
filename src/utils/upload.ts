import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");

const ALLOWED_MIMES: Record<string, { type: "IMAGE" | "AUDIO" | "DOCUMENT"; maxSize: number }> = {
  "image/jpeg": { type: "IMAGE", maxSize: 10 * 1024 * 1024 },
  "image/png": { type: "IMAGE", maxSize: 10 * 1024 * 1024 },
  "image/webp": { type: "IMAGE", maxSize: 10 * 1024 * 1024 },
  "image/gif": { type: "IMAGE", maxSize: 10 * 1024 * 1024 },
  "audio/mpeg": { type: "AUDIO", maxSize: 50 * 1024 * 1024 },
  "audio/mp3": { type: "AUDIO", maxSize: 50 * 1024 * 1024 },
  "audio/wav": { type: "AUDIO", maxSize: 50 * 1024 * 1024 },
  "audio/ogg": { type: "AUDIO", maxSize: 50 * 1024 * 1024 },
  "application/pdf": { type: "DOCUMENT", maxSize: 20 * 1024 * 1024 },
};

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/ogg": ".ogg",
  "application/pdf": ".pdf",
};

export interface UploadResult {
  filename: string;
  url: string;
  type: "IMAGE" | "AUDIO" | "DOCUMENT";
  size: number;
  mimeType: string;
}

export interface UploadError {
  error: string;
}

export async function processUpload(
  file: File
): Promise<UploadResult | UploadError> {
  const mimeConfig = ALLOWED_MIMES[file.type];
  if (!mimeConfig) {
    return { error: `Type de fichier non autorisé: ${file.type}` };
  }

  if (file.size > mimeConfig.maxSize) {
    const maxMB = mimeConfig.maxSize / (1024 * 1024);
    return { error: `Fichier trop volumineux. Maximum: ${maxMB}MB` };
  }

  const ext = MIME_EXTENSIONS[file.type] || ".bin";
  const uuid = uuidv4();
  const filename = `${uuid}${ext}`;
  const subDir = mimeConfig.type.toLowerCase() + "s";
  const dirPath = path.join(UPLOAD_DIR, subDir);

  await fs.mkdir(dirPath, { recursive: true });

  const filePath = path.join(dirPath, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const url = `/api/uploads/${subDir}/${filename}`;

  return {
    filename,
    url,
    type: mimeConfig.type,
    size: file.size,
    mimeType: file.type,
  };
}

export function isUploadError(result: UploadResult | UploadError): result is UploadError {
  return "error" in result;
}
