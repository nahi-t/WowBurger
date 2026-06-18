"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemsController = void 0;
const common_1 = require("@nestjs/common");
const menu_items_service_1 = require("../menu-items/provider/menu-items.service");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../user/user.entity");
const passport_1 = require("@nestjs/passport");
const PaginationDto_1 = require("./dto/PaginationDto");
let MenuItemsController = class MenuItemsController {
    menuItemsService;
    constructor(menuItemsService) {
        this.menuItemsService = menuItemsService;
    }
    async findAll(paginationDto) {
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
        return {
            data: formattedData,
            meta: result.meta,
        };
    }
    create(itemData) {
        return this.menuItemsService.create(itemData);
    }
    remove(id) {
        return this.menuItemsService.remove(id);
    }
    update(id, itemData) {
        return this.menuItemsService.update(id, itemData);
    }
};
exports.MenuItemsController = MenuItemsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationDto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "update", null);
exports.MenuItemsController = MenuItemsController = __decorate([
    (0, common_1.Controller)('menu-items'),
    __metadata("design:paramtypes", [menu_items_service_1.MenuItemsService])
], MenuItemsController);
//# sourceMappingURL=menu-items.controller.js.map