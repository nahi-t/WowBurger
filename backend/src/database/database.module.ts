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
        url: cs.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        
  
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false, 
          },
        },
        
        entities: [User, Category, MenuItem, ItemVariant], 
        
        synchronize: true, // Perfect for setting up WowBurger tables quickly!
        logging: cs.get('TYPEORM_LOGGING') === 'true',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}