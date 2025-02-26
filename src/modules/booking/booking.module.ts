import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Venue } from '../venue/entities/veneu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Venue, Event])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
