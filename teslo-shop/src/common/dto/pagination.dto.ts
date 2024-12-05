import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'How many rows do you need?',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number) // similar a enableImplicitConversion
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many rows do you want to skip?',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number) // similar a enableImplicitConversion
  offset?: number;
}
