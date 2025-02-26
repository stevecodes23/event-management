import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsEnum,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TicketType } from '../entities/event-ticket.entity';
class CreateTicketDto {
  @IsEnum(TicketType)
  type: TicketType;

  @IsNumber()
  totalQuantity: number;

  @IsInt()
  price: number;
}
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNumber()
  @Min(1)
  venueId: number;

  @IsNumber()
  @Min(1)
  organiserId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketDto)
  tickets: CreateTicketDto[];
}
