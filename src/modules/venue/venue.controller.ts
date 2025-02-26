import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { VenueService } from './venue.service';
import { User, UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { CreateVenueDto, UpdateVenueDto } from './dto/veneu.dto';
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
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)

  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser('id') userId:number) {
    return await this.venueService.remove(id, userId);
  }
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateVenueDto: UpdateVenueDto,
  ) {
    return this.venueService.update(id, updateVenueDto);
  }
}
