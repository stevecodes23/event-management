import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Notification } from './entities/notification.entity';
import * as postmark from 'postmark';
import { ENV } from 'src/constants/env.constant';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { join } from 'path';
@Injectable()
export class NotificationService {
  private client: postmark.ServerClient;
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.client = new postmark.ServerClient(ENV.POSTMARK.API_KEY);
  }

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
  async sendEmail(
    name: string,
    toEmailId: string,
    mailSubject: string,
    template: string,
    cc?: string[],
    remarks?: string,
    context?: object,
  ) {
    try {
      const templatePath = join(process.cwd(), `src/template/${template}`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(
          `Template file does not exist at path: ${templatePath}`,
        );
      }

      const templateBuffer = fs.readFileSync(templatePath, 'utf-8');
      const rendered = ejs.render(templateBuffer, context);

      await this.client.sendEmail({
        From: ` Event Management <${ENV.EMAIL.EMAIL_ID}>`,
        To: toEmailId,
        Cc: Array.isArray(cc) ? cc.join(', ') : cc,
        Subject: mailSubject,
        HtmlBody: rendered,
      });
    } catch (error) {
      console.error('Error in sendEmail:', error.message);
      throw error;
    }
  }
}
