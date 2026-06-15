import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Added this
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './provider/menu-items.service';
import { MenuItem } from '../menu-items/ menu-item.entity'; // Make sure this path points to your MenuItem entity
import { ItemVariant } from './item-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem,ItemVariant]), // Registers the MenuItem repository
  ],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService], // Export it so other modules (like Orders or Categories) can use it
})
export class MenuItemsModule {}