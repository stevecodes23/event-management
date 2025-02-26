import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { Public } from 'src/decorator/public.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventService.create(createEventDto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
    @GetUser('id') userId: number,
  ) {
    return await this.eventService.update(id, updateEventDto, userId);
  }
  @Public()
  @Get()
  async findAll() {
    return await this.eventService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.eventService.findOne(id);
  }
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser('id') userId: number) {
    return await this.eventService.remove(id, userId);
  }
}
