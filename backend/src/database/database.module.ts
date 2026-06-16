import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity'; 
import { Category } from '../categories/category.entity';
import { MenuItem } from '../menu-items/menu-item.entity';
import { ItemVariant } from '../menu-items/item-variant.entity'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('POSTGRES_HOST') || 'localhost',
        port: cs.get<number>('POSTGRES_PORT') || 5432,
        username: cs.get<string>('POSTGRES_USER') || 'postgres',
        password: String(cs.get('POSTGRES_PASSWORD') || ''),
        database: cs.get<string>('POSTGRES_DB') || 'wow_burger_db',
        
        // 2. ADD IT HERE: Include Variant alongside MenuItem
        entities: [User, Category, MenuItem, ItemVariant], 
        
        synchronize: true, 
        logging: cs.get('TYPEORM_LOGGING') === 'true',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}