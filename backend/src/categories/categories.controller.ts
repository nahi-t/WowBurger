import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../categories/provider/categories.service';
import { Category } from '../categories/category.entity';
// Standard passport JwtAuthGuard
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoriesService.create(categoryData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() categoryData: Partial<Category>,
  ): Promise<Category> {
    return this.categoriesService.update(id, categoryData);
  }
}