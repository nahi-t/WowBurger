import { Repository } from 'typeorm';
import { MenuItem } from '../menu-item.entity';
import { PaginationDto } from '../dto/PaginationDto';
export declare class MenuItemsService {
    private readonly menuItemRepository;
    constructor(menuItemRepository: Repository<MenuItem>);
    findAll(paginationDto: PaginationDto): Promise<{
        data: MenuItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(itemData: Partial<MenuItem>): Promise<MenuItem>;
    remove(id: string): Promise<void>;
    update(id: string, itemData: Partial<MenuItem>): Promise<MenuItem>;
}
