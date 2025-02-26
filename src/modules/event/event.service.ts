import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from '../venue/entities/veneu.entity';
import { User } from '../auth/entities/user.entity';
import { EventTicket } from './entities/event-ticket.entity';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EventTicket)
    private eventTicketRepository: Repository<EventTicket>,
  ) {}
  async create(createEventDto: CreateEventDto) {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      venueId,
      organiserId,
    } = createEventDto;

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
    });
    if (!venue) {
      throw new Error('Venue not found');
    }

    const organiser = await this.userRepository.findOne({
      where: { id: organiserId },
    });
    if (!organiser) {
      throw new Error('Organizer not found');
    }

    const event = this.eventRepository.create({
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      organiser,
    });

    const savedEvent = await this.eventRepository.save(event);

    const tickets = createEventDto.tickets.map((ticketDto) =>
      this.eventTicketRepository.create({
        type: ticketDto.type,
        totalQuantity: ticketDto.totalQuantity,
        price: ticketDto.price,
        event: savedEvent,
      }),
    );

    await this.eventTicketRepository.save(tickets);

    return savedEvent;
  }
}
