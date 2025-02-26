import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { VenueService } from './venue.service';
import { UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { CreateVenueDto } from './dto/veneu.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @Post()
  async create(
    @Body() createVenueDto: CreateVenueDto,
    @GetUser('id') userId: number,
  ) {
    return this.venueService.create(createVenueDto, userId);
  }
  @Public()
  @Get()
  async findAll() {
    return await this.venueService.findAll();
  }
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.venueService.findOne(id);
  }
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser('id') userId:number) {
    return await this.venueService.remove(id, userId);
  }
}
