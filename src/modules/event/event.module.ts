import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Venue } from '../venue/entities/veneu.entity';
import { User } from '../auth/entities/user.entity';
import { EventTicket } from './entities/event-ticket.entity';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Venue, User, EventTicket])],
  exports: [EventService],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
