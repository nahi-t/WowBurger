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
exports.MenuItemsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_item_entity_1 = require("../menu-item.entity");
let MenuItemsService = class MenuItemsService {
    menuItemRepository;
    constructor(menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }
    async findAll(paginationDto) {
        const page = Number(paginationDto.page) || 1;
        const limit = Number(paginationDto.limit) || 5;
        const search = paginationDto.search ? String(paginationDto.search).trim() : '';
        const skip = (page - 1) * limit;
        const queryBuilder = this.menuItemRepository.createQueryBuilder('menuItem')
            .leftJoinAndSelect('menuItem.category', 'category')
            .select();
        if (search !== '') {
            queryBuilder.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('menuItem.name ILIKE :search', { search: `%${search}%` })
                    .orWhere('menuItem.description ILIKE :search', { search: `%${search}%` });
            }));
        }
        queryBuilder
            .orderBy('menuItem.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    create(itemData) {
        const newItem = this.menuItemRepository.create(itemData);
        return this.menuItemRepository.save(newItem);
    }
    async remove(id) {
        const result = await this.menuItemRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Menu item with ID "${id}" not found`);
        }
    }
    async update(id, itemData) {
        const item = await this.menuItemRepository.preload({
            id,
            ...itemData,
        });
        if (!item) {
            throw new common_1.NotFoundException(`Menu item with ID "${id}" not found`);
        }
        return await this.menuItemRepository.save(item);
    }
};
exports.MenuItemsService = MenuItemsService;
exports.MenuItemsService = MenuItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuItemsService);
//# sourceMappingURL=menu-items.service.js.map