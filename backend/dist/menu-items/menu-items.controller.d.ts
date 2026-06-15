import { MenuItemsService } from '../menu-items/provider/menu-items.service';
import { MenuItem } from '../menu-items/ menu-item.entity';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    findAll(): Promise<MenuItem[]>;
    create(itemData: Partial<MenuItem>): Promise<MenuItem>;
    remove(id: string): Promise<void>;
}
