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
      useFactory: (cs: ConfigService) => {
        const isProduction = cs.get<string>('NODE_ENV') === 'production';
        
        return {
          type: 'postgres',
          // If you prefer individual variables over a single URL string:
          host: cs.get<string>('DB_HOST') || 'postgres', 
          port: cs.get<number>('DB_PORT') || 5432,
          username: cs.get<string>('DB_USERNAME') || 'myuser',
          password: cs.get<string>('DB_PASSWORD') || 'mypassword',
          database: cs.get<string>('DB_NAME') || 'my_database',
          
          autoLoadEntities: true,
          entities: [User, Category, MenuItem, ItemVariant], 
          synchronize: true, 
          logging: cs.get('TYPEORM_LOGGING') === 'true',
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          
          // 🛑 FIX: Disable SSL for local Docker development
         
          extra: isProduction ? {
            ssl: {
              rejectUnauthorized: false, 
            },
          } : {},
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}