import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetUser } from 'src/decorator/get-user.decorator';

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
}
