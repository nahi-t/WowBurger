import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  inject: [ConfigService], // <-- This forces NestJS to wait for the configuration to load
  useFactory: (configService: ConfigService) => {
    // Explicitly pull the URL from ConfigService to guarantee it exists at runtime
    const cloudinaryUrl = configService.get<string>('CLOUDINARY_URL');
    
    return cloudinary.config({
      secure: true,
    });
  },
};