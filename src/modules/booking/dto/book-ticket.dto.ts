import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class BookTicketDto {
  @IsInt()
  @Min(1)
  ticketId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
export class BookTicketWithPGDto {
  @IsInt()
  @Min(1)
  ticketId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  paymentToken: string;
}
