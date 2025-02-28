import { Controller, Get, Post } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { User, UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Get('user-list')
  async getUserList(): Promise<User[]> {
    return await this.dashboardService.getUserList();
  }
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Get('events-info')
  async getEventData(): Promise<any> {
    return await this.dashboardService.getEventData();
  }
}
