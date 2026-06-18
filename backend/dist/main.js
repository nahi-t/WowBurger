"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("./user/user.entity");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const user_service_1 = require("./user/provider/user.service");
const categories_service_1 = require("./categories/provider/categories.service");
const menu_items_service_1 = require("./menu-items/provider/menu-items.service");
const seed_data_1 = require("./database/seed-data");
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    app.enableCors();
    const userService = app.get(user_service_1.UserService);
    const defaultAdminEmail = 'admin@g.com';
    const adminExists = await userService.findOneByEmail(defaultAdminEmail);
    if (!adminExists) {
        console.log('No admin found. Creating default admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await userService.create({
            email: defaultAdminEmail,
            passwordHash: hashedPassword,
            role: user_entity_1.UserRole.ADMIN,
        });
        console.log('Default admin user created successfully!');
    }
    else if (adminExists.role !== user_entity_1.UserRole.ADMIN) {
        console.log('Correcting default admin user role to ADMIN...');
        adminExists.role = user_entity_1.UserRole.ADMIN;
        await userService.create(adminExists);
    }
    const categoriesService = app.get(categories_service_1.CategoriesService);
    const menuItemsService = app.get(menu_items_service_1.MenuItemsService);
    const existingCategories = await categoriesService.findAll();
    if (existingCategories.length === 0) {
        console.log('Seeding initial categories...');
        const categoryMap = new Map();
        for (const catData of seed_data_1.SEED_CATEGORIES) {
            const createdCat = await categoriesService.create(catData);
            categoryMap.set(catData.slug, createdCat);
        }
        console.log('Categories seeded. Seeding menu items...');
        for (const itemData of seed_data_1.SEED_MENU_ITEMS) {
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
//# sourceMappingURL=main.js.map