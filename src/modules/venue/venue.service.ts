import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Venue } from './entities/venue.entity';
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
  async create(createVenueDto: CreateVenueDto, userId: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const venue = this.venueRepository.create({
      ...createVenueDto,
      addedBy: user,
    });
    const { addedBy, ...savedVenue } = await this.venueRepository.save(venue);
    return savedVenue;
  }
  async findAll(): Promise<Venue[]> {
    return await this.venueRepository.find({
      where: { deletedAt: IsNull() },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        capacity: true,
      },
    });
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { id, deletedAt: IsNull() },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        capacity: true,
      },
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
