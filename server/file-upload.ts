import * as path from 'path';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import multer from 'multer';
import { Request } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
fs.ensureDirSync(UPLOAD_DIR);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const userId = req.user?.id;
    const userDir = path.join(UPLOAD_DIR, `user-${userId || 'anonymous'}`);
    fs.ensureDirSync(userDir);
    cb(null, userDir);
  },
  filename: function(req, file, cb) {
    // Generate a unique file name to prevent conflicts
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileExt = path.extname(file.originalname);
    
    // Ensure we get a meaningful filename by handling file.originalname properly
    const originalName = file.originalname || `image${fileExt}`;
    
    // Create a safe name by removing invalid characters
    const safeName = originalName
      .replace(/[^a-zA-Z0-9.]/g, '-')  // Keep the dot for extension detection
      .replace(/-+/g, '-')
      .toLowerCase();
    
    cb(null, `${safeName.substring(0, 40)}-${uniqueId}${fileExt}`);
  }
});

// File filter to only allow certain types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Supported types: ${allowedMimes.join(', ')}`));
  }
};

// Configure limits
const limits = {
  fileSize: 20 * 1024 * 1024, // 20MB
  files: 25 // Max 25 files per upload
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits
});

// Function to get the public URL for a file
export function getFileUrl(filename: string, userId: number): string {
  return `/uploads/user-${userId}/${filename}`;
}

// Function to delete a file
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // Strip the leading slash if it exists
    const cleanUrl = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
    const filePath = path.join(process.cwd(), cleanUrl);
    
    // Check if file exists
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}