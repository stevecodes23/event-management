import { Body, Controller, Post, Req } from '@nestjs/common';
import { VenueService } from './venue.service';
import { UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { CreateVenueDto } from './dto/veneu.dto';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @Post()
  async create(@Body() createVenueDto: CreateVenueDto, @Req() req) {
    const userId = req.user.id;
    return this.venueService.create(createVenueDto, userId);
  }
}
