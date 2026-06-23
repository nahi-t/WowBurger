import { ConfigModule, ConfigService } from '@nestjs/config'; // Added ConfigService here
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule } from './menu-items/menu-items.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UplodeModule } from './uplode/uplode.module';
import { ViewModule } from './view/view.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loaded at the very top
    UserModule, 
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    MenuItemsModule,
    CloudinaryModule,
    UplodeModule,
    
    // 👇 FIX: Converted to registerAsync to properly read your Render Environment Variable
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Reads from your Render production config, or falls back to your local machine!
        const redisUrl = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        
        return {
          stores: [new KeyvRedis(redisUrl)],
        };
      },
    }),
    
    ViewModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}