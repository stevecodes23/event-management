import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNotification(userId: number, title: string, message: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const notification = this.notificationRepository.create({
      title,
      message,
      user,
    });
    return await this.notificationRepository.save(notification);
  }
  async getUserNotifications(userId: number) {
    return await this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
  async markAsRead(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!notification)
      throw new NotFoundException(`Notification with ID ${id} not found`);
    return await this.notificationRepository.update(id, { isRead: true });
  }
}
