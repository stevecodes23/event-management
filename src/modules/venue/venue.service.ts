import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Venue } from './entities/veneu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateVenueDto, UpdateVenueDto } from './dto/veneu.dto';

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
    });
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }
  async remove(id: number, userId: number): Promise<void> {
    const venue = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    venue.deletedBy = user;
    await this.venueRepository.save(venue);
    await this.venueRepository.softDelete(id);
  }
  async update(
    id: number,
    updateVenueDto: UpdateVenueDto,
  ): Promise<Venue | null> {
    await this.venueRepository.findOne({ where: { id } });
    if (!updateVenueDto) return null;
    await this.venueRepository.update(id, updateVenueDto);
    return await this.venueRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        capacity: true,
      },
    });
  }
}
