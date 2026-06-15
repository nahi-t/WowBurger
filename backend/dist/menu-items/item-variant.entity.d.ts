import { MenuItem } from './menu-item.entity';
export declare class ItemVariant {
    id: string;
    menuItemId: string;
    menuItem: MenuItem;
    name: string;
    price: number;
    isAvailable: boolean;
}
