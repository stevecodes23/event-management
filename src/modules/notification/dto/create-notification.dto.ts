import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotification {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  message: string;
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
