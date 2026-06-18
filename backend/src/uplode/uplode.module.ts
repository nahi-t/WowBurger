import { Module } from '@nestjs/common';
import { UplodeController } from './uplode.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [UplodeController],
  imports: [CloudinaryModule],
})
export class UplodeModule {}
