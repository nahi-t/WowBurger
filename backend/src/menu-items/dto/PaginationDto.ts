import { IsOptional, IsInt, Min, IsString } from 'class-validator'; // Added IsString
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 5; 

  // FIX: Explicitly decorate the search query string
  @IsOptional()
  @IsString()
  search?: string;
}