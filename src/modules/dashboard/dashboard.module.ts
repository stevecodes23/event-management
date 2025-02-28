import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Event } from '../event/entities/event.entity';
import { EventTicket } from '../event/entities/event-ticket.entity';
import { Notification } from '../notification/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, EventTicket, Notification])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
