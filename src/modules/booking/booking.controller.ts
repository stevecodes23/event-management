import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetUser } from 'src/decorator/get-user.decorator';
import { BookTicketDto, BookTicketWithPGDto } from './dto/book-ticket.dto';
import { UserRole } from '../auth/entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER, UserRole.USER)
  @Post('book-ticket')
  async bookTicket(@GetUser('id') userId: number, @Body() body: BookTicketDto) {
    const { ticketId, quantity } = body;
    return await this.bookingService.bookTicket(userId, ticketId, quantity);
  }
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER, UserRole.USER)
  @Post('book-ticket-with_payment-gateway')
  async bookTicketwithgateway(
    @GetUser('id') userId: number,
    @Body() body: BookTicketWithPGDto,
  ) {
    const { ticketId, quantity, paymentToken } = body;
    return await this.bookingService.bookTicketWithPaymentGateway(
      userId,
      ticketId,
      quantity,
      paymentToken,
    );
  }
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER, UserRole.USER)
  @Get('my-bookings')
  async getUserBookings(@GetUser('id') userId: number) {
    return this.bookingService.getUserBookings(userId);
  }
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.ORGANISER, UserRole.USER)
  @Get('download-ticket/:bookingId')
  async downloadTicket(
    @GetUser('id') userId: number,
    @Param('bookingId') bookingId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.bookingService.generateTicket(
      userId,
      bookingId,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ticket-${bookingId}.pdf"`,
    });
    res.send(pdfBuffer);
  }
}
