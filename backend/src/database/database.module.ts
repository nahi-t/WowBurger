import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Category } from '../categories/category.entity';
import { MenuItem } from '../menu-items/menu-item.entity';
import { ItemVariant } from '../menu-items/item-variant.entity';
import { ViewAnalytics } from 'src/view/view-analytics.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('DATABASE_HOST'),
        port: cs.get<number>('DATABASE_PORT'),
        username: cs.get<string>('DATABASE_USER'),
        password: cs.get<string>('DATABASE_PASSWORD'),
        database: cs.get<string>('DATABASE_NAME'),
        entities: [User, Category, MenuItem, ItemVariant,ViewAnalytics],
        synchronize: true, // use only in development
        logging: cs.get('TYPEORM_LOGGING') === 'true',
        ssl: false, // ✅ critical: disable SSL for local PostgreSQL
        // No 'extra' block needed
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}