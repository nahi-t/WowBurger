import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './provider/menu-items.service';
import { MenuItem } from '../menu-items/menu-item.entity';
import { ItemVariant } from './item-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem,ItemVariant]), 
  ],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService], 
})
export class MenuItemsModule {}