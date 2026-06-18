import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'wowburger_items' },
        // FIX: Add '?' to error to accept 'UploadApiErrorResponse | undefined'
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(new BadRequestException(error.message));
          if (!result) return reject(new BadRequestException('Cloudinary upload returned no result.'));
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(uploadStream);
    });
  }
}