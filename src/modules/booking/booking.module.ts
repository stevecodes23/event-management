import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Venue } from '../venue/entities/veneu.entity';
import { Booking } from './entities/booking.entity';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Venue, Event, Booking])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
