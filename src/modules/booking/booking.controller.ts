import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetUser } from 'src/decorator/get-user.decorator';
import { BookTicketDto } from './dto/book-ticket.dto';
import { UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER)
  @Post('book-ticket')
  async bookTicket(@GetUser('id') userId: number, @Body() body: BookTicketDto) {
    const { ticketId, quantity } = body;
    return await this.bookingService.bookTicket(userId, ticketId, quantity);
  }
}
