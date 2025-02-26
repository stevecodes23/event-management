import { IsString, IsInt, Min, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateVenueDto {
  @IsString()
  @MaxLength(255)
  name: string;
  
  @IsString()
  @MaxLength(255)
  address: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(100)
  state: string;

  @IsInt()
  @Min(1)
  capacity: number;
}

export class UpdateVenueDto extends PartialType(CreateVenueDto) {}
