import { UserService } from './provider/user.service';
import { UpdateUserDto } from './DTO/user-dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./user.entity").User>;
}
