import { ConfigModule } from '@nestjs/config';
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

  imports: [UserModule, DatabaseModule,
 ConfigModule.forRoot({isGlobal:true}),
 AuthModule,
 CategoriesModule,
 MenuItemsModule,
 CloudinaryModule,
 UplodeModule,
 CacheModule.register({
      isGlobal: true, // Makes CacheManager available everywhere without re-importing
      stores: [
        new KeyvRedis('redis://localhost:6379'), // Connects directly to local Redis
      ],
    }),
 ViewModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
