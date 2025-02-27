import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotification } from './dto/create-notification.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

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
}
