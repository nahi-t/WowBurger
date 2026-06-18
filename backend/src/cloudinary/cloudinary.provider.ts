import { Provider } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: () => {
    // If CLOUDINARY_URL exists, calling config() automatically extracts everything
    return cloudinary.config({
      secure: true, // Forces delivery links to generate with HTTPS protocol
    });
  },
};