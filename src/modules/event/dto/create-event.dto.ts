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
  Matches,
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
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'endTime must be in HH:mm format',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'endTime must be in HH:mm format',
  })
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
