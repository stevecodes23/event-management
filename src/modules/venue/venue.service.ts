import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Venue } from './entities/veneu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateVenueDto } from './dto/veneu.dto';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createVenueDto: CreateVenueDto, userId: number): Promise<Venue> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const venue = this.venueRepository.create({
      ...createVenueDto,
      addedBy: user,
    });
    return await this.venueRepository.save(venue);
  }
  async findAll(): Promise<Venue[]> {
    return await this.venueRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['addedBy', 'deletedBy'],
    });
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['addedBy', 'deletedBy'],
    });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }
}
