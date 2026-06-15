import { MenuItem } from '../menu-items/menu-item.entity';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    displayOrder: number;
    isActive: boolean;
    description?: string;
    iconName?: string;
    menuItems: MenuItem[];
    createdAt: Date;
}
