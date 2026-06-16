import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';

/**
 * DTO for creating a new user
 */
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}

/**
 * DTO for updating a user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

/**
 * DTO for user response (excludes sensitive data like passwordHash)
 */
export class UserResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  createdAt!: Date;
}