"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity");
const category_entity_1 = require("../categories/category.entity");
const menu_item_entity_1 = require("../menu-items/menu-item.entity");
const item_variant_entity_1 = require("../menu-items/item-variant.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cs) => ({
                    type: 'postgres',
                    url: cs.get('DATABASE_URL'),
                    autoLoadEntities: true,
                    ssl: true,
                    extra: {
                        ssl: {
                            rejectUnauthorized: false,
                        },
                    },
                    entities: [user_entity_1.User, category_entity_1.Category, menu_item_entity_1.MenuItem, item_variant_entity_1.ItemVariant],
                    synchronize: true,
                    logging: cs.get('TYPEORM_LOGGING') === 'true',
                }),
            }),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map