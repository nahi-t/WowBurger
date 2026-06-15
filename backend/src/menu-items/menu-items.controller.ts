import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MenuItemsService } from '../menu-items/provider/menu-items.service';
import { MenuItem } from '../menu-items/ menu-item.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/ roles.decorator';
import { UserRole } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() itemData: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuItemsService.create(itemData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.menuItemsService.remove(id);
  }
}