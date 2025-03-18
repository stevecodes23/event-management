import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from '../venue/entities/venue.entity';
import { User } from '../auth/entities/user.entity';
import { EventTicket } from './entities/event-ticket.entity';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organiser: _, ...result } = updated_event;
    return result;
  }
  async findAll() {
    return await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('event.organiser', 'organiser')
      .leftJoinAndSelect('event.tickets', 'tickets')
      .where('event.deletedAt IS NULL')
      .select([
        'event.id',
        'event.title',
        'event.description',
        'event.date',
        'event.startTime',
        'event.endTime',
        'venue.id',
        'venue.name',
        'venue.address',
        'venue.city',
        'venue.state',
        'venue.capacity',
        'organiser.id',
        'organiser.name',
        'tickets.type',
        'tickets.price',
        'tickets.totalQuantity',
        'tickets.soldQuantity',
        'tickets.reservedQuantity',
      ])
      .getMany();
  }

  async findOne(id: number) {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('event.organiser', 'organiser')
      .leftJoinAndSelect('event.tickets', 'tickets')
      .where('event.id = :id', { id })
      .andWhere('event.deletedAt IS NULL')
      .select([
        'event.id',
        'event.title',
        'event.description',
        'event.date',
        'event.startTime',
        'event.endTime',
        'venue.id',
        'venue.address',
        'venue.city',
        'venue.state',
        'venue.capacity',
        'organiser.id',
        'organiser.name',
        'tickets.type',
        'tickets.price',
        'tickets.totalQuantity',
        'tickets.soldQuantity',
        'tickets.reservedQuantity',
      ])
      .getOne();
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organiser: _, ...restOfDeletedEvent } = deleteEvent;
    return restOfDeletedEvent;
  }
}
