import { Injectable } from '@nestjs/common';
import { EventTicket } from '../event/entities/event-ticket.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { Event } from '../event/entities/event.entity';
import { Notification } from '../notification/entities/notification.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(EventTicket)
    private readonly eventTicketRepository: Repository<EventTicket>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Notification)
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserList() {
    const users = await this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return users;
  }
  async getEventData() {
    const events = await this.eventRepository.find({
      order: {
        date: 'DESC',
      },
      relations: ['tickets'],
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        startTime: true,
        endTime: true,
        tickets: {
          id: true,
          reservedQuantity: true,
          price: true,
          type: true,
          totalQuantity: true,
          soldQuantity: true,
        },
      },
    });
    if (events.length > 0) {
      const eventsData = events.map((event) => {
        let totalSoldQuantity = 0;
        let totalReservedQuantity = 0;
        let totalTicketQuantity = 0;

        const ticketsInfo = event.tickets.map((ticket) => {
          totalSoldQuantity += ticket.soldQuantity;
          totalReservedQuantity += ticket.reservedQuantity;
          totalTicketQuantity += ticket.totalQuantity;

          return {
            id: ticket.id,
            reservedQuantity: ticket.reservedQuantity,
            price: ticket.price,
            type: ticket.type,
            totalQuantity: ticket.totalQuantity,
            soldQuantity: ticket.soldQuantity,
            soldPercentage:
              ticket.totalQuantity > 0
                ? ((ticket.soldQuantity + ticket.reservedQuantity) /
                    ticket.totalQuantity) *
                  100
                : 0,
          };
        });
        const cumulativeSoldPercentage =
          totalTicketQuantity > 0
            ? ((totalSoldQuantity + totalReservedQuantity) /
                totalTicketQuantity) *
              100
            : 0;

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          tickets: ticketsInfo,
          cumulativeSoldPercentage: cumulativeSoldPercentage.toFixed(2),
        };
      });
      return eventsData;
    }
    return [];
  }
}
