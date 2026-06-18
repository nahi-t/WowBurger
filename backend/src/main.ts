import { UserRole } from './user/user.entity';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/provider/user.service';
import { CategoriesService } from './categories/provider/categories.service';
import { MenuItemsService } from './menu-items/provider/menu-items.service';
import { SEED_CATEGORIES, SEED_MENU_ITEMS } from './database/seed-data';
import * as bcrypt from 'bcrypt';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
  transform: true, // Automatically converts query strings to numbers
  whitelist: true,
}));

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], // 👈 ALLOW CLOUDINARY IMAGES
//       },
//     },
//   }),
// );

  // Enable CORS
  app.enableCors();

  const userService = app.get(UserService);
  const defaultAdminEmail = 'admin@g.com';
  const adminExists = await userService.findOneByEmail(defaultAdminEmail);

  if (!adminExists) {
    console.log('No admin found. Creating default admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10); 
    await userService.create({
      email: defaultAdminEmail,
      passwordHash: hashedPassword,
      role: UserRole.ADMIN, // Set admin role explicitly
    });
    console.log('Default admin user created successfully!');
  } else if (adminExists.role !== UserRole.ADMIN) {
    console.log('Correcting default admin user role to ADMIN...');
    adminExists.role = UserRole.ADMIN;
    await userService.create(adminExists);
  }

  // Seed Categories & Menu Items if database is empty
  const categoriesService = app.get(CategoriesService);
  const menuItemsService = app.get(MenuItemsService);

  const existingCategories = await categoriesService.findAll();
  if (existingCategories.length === 0) {
    console.log('Seeding initial categories...');
    const categoryMap = new Map<string, any>();
    for (const catData of SEED_CATEGORIES) {
      const createdCat = await categoriesService.create(catData);
      categoryMap.set(catData.slug, createdCat);
    }

    console.log('Categories seeded. Seeding menu items...');
    for (const itemData of SEED_MENU_ITEMS) {
      const cat = categoryMap.get(itemData.categorySlug);
      if (cat) {
        const { categorySlug, ...rest } = itemData;
        await menuItemsService.create({
          ...rest,
          categoryId: cat.id,
        });
      }
    }
    console.log('Seeding completed successfully!');
  }

  await app.listen(5001);
  console.log('Backend is running on http://localhost:5001');
}
bootstrap();