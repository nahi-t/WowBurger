import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: string, userData: Partial<User> & { password?: string }): Promise<User> {
    const updateData: Partial<User> = { ...userData } as any;

    if (userData.password) {
      updateData.passwordHash = await bcrypt.hash(userData.password, 10);
      delete (updateData as any).password;
    }

    const user = await this.usersRepository.preload({ id, ...updateData });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersRepository.save(user);
  }
}
