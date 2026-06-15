import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Added this
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './provider/categories.service';
import { Category } from './category.entity'; // Make sure this path points to your Category entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]), // Registers the repository so CategoriesService can inject it
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // Export it in case other modules need to use it
})
export class CategoriesModule {}