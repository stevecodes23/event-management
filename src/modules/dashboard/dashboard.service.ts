import { Injectable } from '@nestjs/common';
import { EventTicket } from '../event/entities/event-ticket.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(EventTicket)
    private readonly eventTicketRepository: Repository<EventTicket>,
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
}
