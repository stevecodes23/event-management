import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from '../venue/entities/veneu.entity';
import { User } from '../auth/entities/user.entity';
import { EventTicket } from './entities/event-ticket.entity';
import { Event } from './entities/event.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

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
    const { organiser: _, ...result } = savedEvent;
    return result;
  }
  async update(id: number, updateEventDto: UpdateEventDto, userId: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new HttpException(`Event with ID ${id} not found`, 404);
    if (event.organiser.id !== userId) {
      throw new ForbiddenException('You are not allowed to update this event.');
    }
    Object.assign(event, updateEventDto);
    const updated_event = await this.eventRepository.save(event);
    const { organiser: _, ...result } = updated_event;
    return result;
  }
  async findAll() {
    return await this.eventRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      relations: ['venue', 'organiser'],
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        startTime: true,
        endTime: true,
        venue: {
          id: true,
          address: true,
          city: true,
          state: true,
          capacity: true,
        },
        organiser: {
          name: true,
        },
        tickets: {
          type: true,
          price: true,
          totalQuantity: true,
          soldQuantity: true,
          reservedQuantity: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['venue', 'organiser'],
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        startTime: true,
        endTime: true,
        venue: {
          id: true,
          address: true,
          city: true,
          state: true,
          capacity: true,
        },
        organiser: {
          name: true,
        },
        tickets: {
          type: true,
          price: true,
          totalQuantity: true,
          soldQuantity: true,
          reservedQuantity: true,
        },
      },
    });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return event;
  }
  async remove(id: number, userId: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organiser'],
    });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

    if (event.organiser.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this event.');
    }

    event.deletedAt = new Date();
    const deleteEvent = await this.eventRepository.save(event);
    const { organiser: _, ...restOfDeletedEvent } = deleteEvent;
    return restOfDeletedEvent;
  }
}
