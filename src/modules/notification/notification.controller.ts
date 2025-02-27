import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotification } from './dto/create-notification.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Post()
  async createNotification(@Body() body: CreateNotification) {
    return this.notificationService.createNotification(
      body.userId,
      body.title,
      body.message,
    );
  }
  @Get()
  async getUserNotifications(@GetUser('id') userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }
}
