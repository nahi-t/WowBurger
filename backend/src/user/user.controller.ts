import { Controller, Put, Body, Param, UseGuards } from '@nestjs/common';
import { RolesGuard } from "../auth/roles.guard"
import { UserService } from './provider/user.service';
import { UpdateUserDto } from './DTO/user-dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put(':id')
  @UseGuards(RolesGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}