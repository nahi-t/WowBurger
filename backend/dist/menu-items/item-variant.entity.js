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
exports.ItemVariant = void 0;
const typeorm_1 = require("typeorm");
const menu_item_entity_1 = require("./menu-item.entity");
let ItemVariant = class ItemVariant {
    id;
    menuItemId;
    menuItem;
    name;
    price;
    isAvailable;
};
exports.ItemVariant = ItemVariant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ItemVariant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'menu_item_id' }),
    __metadata("design:type", String)
], ItemVariant.prototype, "menuItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem, (menuItem) => menuItem.variants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'menu_item_id' }),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], ItemVariant.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ItemVariant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ItemVariant.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_available', default: true }),
    __metadata("design:type", Boolean)
], ItemVariant.prototype, "isAvailable", void 0);
exports.ItemVariant = ItemVariant = __decorate([
    (0, typeorm_1.Entity)('item_variants')
], ItemVariant);
//# sourceMappingURL=item-variant.entity.js.map