import { Body, Controller, Post, Req } from '@nestjs/common';
import { VenueService } from './venue.service';
import { UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { CreateVenueDto } from './dto/veneu.dto';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @Post()
  async create(
    @Body() createVenueDto: CreateVenueDto,
    @GetUser('id') userId: number,
  ) {
    return this.venueService.create(createVenueDto, userId);
  }
}
