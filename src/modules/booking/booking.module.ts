import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Booking } from './entities/booking.entity';
import { Event } from '../event/entities/event.entity';
import { EventTicket } from '../event/entities/event-ticket.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Venue, Event, Booking, EventTicket]),
  ],
  controllers: [BookingController],
  providers: [BookingService, ConfigService],
})
export class BookingModule {}
