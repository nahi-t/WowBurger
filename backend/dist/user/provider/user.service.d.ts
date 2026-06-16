import { Repository } from 'typeorm';
import { User } from '../user.entity';
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOneByEmail(email: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, userData: Partial<User> & {
        password?: string;
    }): Promise<User>;
}
