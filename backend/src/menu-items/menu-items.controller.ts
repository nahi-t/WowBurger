import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MenuItemsService } from '../menu-items/provider/menu-items.service';
import { MenuItem } from '../menu-items/menu-item.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from './dto/PaginationDto';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
async findAll(@Query() paginationDto: PaginationDto) {
 
  const result = await this.menuItemsService.findAll(paginationDto);


  const formattedData = result.data.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category ? item.category.slug : item.categoryId,
    price: item.price,
    description: item.description,
    shortDescription: item.shortDescription,
    ingredients: item.ingredients || [],
    detailedIngredients: item.detailedIngredients || [],
    calories: item.calories || 0,
    dietaryTags: item.dietaryTags || [],
    image: item.imageUrl || '',
    rating: Number(item.rating || 5.0),
    reviewsCount: item.reviewsCount || 0,
    nutrition: item.nutrition || { protein: '0g', carbs: '0g', fat: '0g' },
    customizableOptions: item.customizableOptions || [],
    isAvailable: item.isAvailable,
    categoryId: item.categoryId,
  }));

  // 3. Return the formatted data along with the meta so your frontend stays functional
  return {
    data: formattedData,
    meta: result.meta,
  };
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

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() itemData: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuItemsService.update(id, itemData);
  }
}