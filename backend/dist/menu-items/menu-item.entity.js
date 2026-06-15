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
exports.MenuItem = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../categories/category.entity");
const item_variant_entity_1 = require("./item-variant.entity");
let MenuItem = class MenuItem {
    id;
    categoryId;
    category;
    name;
    slug;
    shortDescription;
    description;
    imageUrl;
    isAvailable;
    price;
    ingredients;
    detailedIngredients;
    calories;
    dietaryTags;
    rating;
    reviewsCount;
    nutrition;
    customizableOptions;
    variants;
    createdAt;
};
exports.MenuItem = MenuItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MenuItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id' }),
    __metadata("design:type", String)
], MenuItem.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.menuItems, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], MenuItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], MenuItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 150 }),
    __metadata("design:type", String)
], MenuItem.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'short_description', length: 255, nullable: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "shortDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', nullable: true, length: 512 }),
    __metadata("design:type", String)
], MenuItem.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_available', default: true }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'Br 0' }),
    __metadata("design:type", String)
], MenuItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    __metadata("design:type", Array)
], MenuItem.prototype, "ingredients", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'detailed_ingredients', default: [] }),
    __metadata("design:type", Array)
], MenuItem.prototype, "detailedIngredients", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { default: 0 }),
    __metadata("design:type", Number)
], MenuItem.prototype, "calories", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'dietary_tags', default: [] }),
    __metadata("design:type", Array)
], MenuItem.prototype, "dietaryTags", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { precision: 2, scale: 1, default: 5.0 }),
    __metadata("design:type", Number)
], MenuItem.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { name: 'reviews_count', default: 0 }),
    __metadata("design:type", Number)
], MenuItem.prototype, "reviewsCount", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], MenuItem.prototype, "nutrition", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'customizable_options', default: [] }),
    __metadata("design:type", Array)
], MenuItem.prototype, "customizableOptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => item_variant_entity_1.ItemVariant, (variant) => variant.menuItem, { cascade: true }),
    __metadata("design:type", Array)
], MenuItem.prototype, "variants", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MenuItem.prototype, "createdAt", void 0);
exports.MenuItem = MenuItem = __decorate([
    (0, typeorm_1.Entity)('menu_items')
], MenuItem);
//# sourceMappingURL=menu-item.entity.js.map