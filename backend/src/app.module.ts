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


@Module({

  imports: [UserModule, DatabaseModule,
 ConfigModule.forRoot({isGlobal:true}),
 AuthModule,
 CategoriesModule,
 MenuItemsModule,
 CloudinaryModule,
 UplodeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
