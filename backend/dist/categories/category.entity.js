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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const menu_item_entity_1 = require("../menu-items/menu-item.entity");
let Category = class Category {
    id;
    name;
    slug;
    displayOrder;
    isActive;
    description;
    iconName;
    menuItems;
    createdAt;
};
exports.Category = Category;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 100 }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', default: 0 }),
    __metadata("design:type", Number)
], Category.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Category.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icon_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "iconName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_item_entity_1.MenuItem, (menuItem) => menuItem.category),
    __metadata("design:type", Array)
], Category.prototype, "menuItems", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)('categories')
], Category);
//# sourceMappingURL=category.entity.js.map