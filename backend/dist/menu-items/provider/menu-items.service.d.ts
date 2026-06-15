import { Repository } from 'typeorm';
import { MenuItem } from '../menu-item.entity';
export declare class MenuItemsService {
    private readonly menuItemRepository;
    constructor(menuItemRepository: Repository<MenuItem>);
    findAll(): Promise<MenuItem[]>;
    create(itemData: Partial<MenuItem>): Promise<MenuItem>;
    remove(id: string): Promise<void>;
    update(id: string, itemData: Partial<MenuItem>): Promise<MenuItem>;
}
