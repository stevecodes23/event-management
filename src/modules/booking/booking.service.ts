import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking, PaymentStatus } from './entities/booking.entity';
import { EventTicket } from '../event/entities/event-ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'src/constants/env.constant';

@Injectable()
export class BookingService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(EventTicket)
    private readonly eventTicketRepository: Repository<EventTicket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>(ENV.STRIPE.KEY) || '',
      {
        apiVersion: '2025-02-24.acacia',
      },
    );
  }
  async bookTicket(userId: number, ticketId: number, quantity: number) {
    const ticket = await this.eventTicketRepository.findOne({
      where: { id: ticketId },
      relations: ['event'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const ticketsLeft =
      ticket.totalQuantity - (ticket.soldQuantity + ticket.reservedQuantity);
    if (ticketsLeft < quantity) {
      throw new BadRequestException('Not enough tickets available');
    }

    const totalAmount = ticket.price * quantity;

    const saveBooking = await this.saveBookingData(
      ticket,
      PaymentStatus.PAID,
      userId,
      quantity,
    );
    ticket.soldQuantity += quantity;
    await this.eventTicketRepository.save(ticket);

    return { message: 'Ticket booked successfully' };
  }
  async saveBookingData(
    ticket: EventTicket,
    paymentStatus: PaymentStatus,
    userId: number,
    quantity: number,
  ): Promise<Booking> {
    const booking = this.bookingRepository.create({
      user: { id: userId },
      ticket,
      quantity,
      totalPrice: ticket.price * quantity,
      paymentStatus: paymentStatus,
    });

    return await this.bookingRepository.save(booking);
  }
  async bookTicketWithPaymentGateway(
    userId: number,
    ticketId: number,
    quantity: number,
    paymentToken: string,
  ) {
    const ticket = await this.eventTicketRepository.findOne({
      where: { id: ticketId },
      relations: ['event'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const ticketsLeft =
      ticket.totalQuantity - (ticket.soldQuantity + ticket.reservedQuantity);
    if (ticketsLeft < quantity) {
      throw new BadRequestException('Not enough tickets available');
    }

    const totalAmount = ticket.price * quantity;

    const payment = await this.stripe.charges.create({
      amount: totalAmount,
      currency: 'inr',
      source: paymentToken,
      description: `Payment for ${quantity} tickets to ${ticket.event.title}`,
    });

    if (!payment.paid) {
      await this.saveBookingData(
        ticket,
        PaymentStatus.FAILED,
        userId,
        quantity,
      );
      throw new BadRequestException('Payment failed');
    }
    if (payment.paid) {
      const saveBooking = await this.saveBookingData(
        ticket,
        PaymentStatus.PAID,
        userId,
        quantity,
      );
      ticket.soldQuantity += quantity;
      await this.eventTicketRepository.save(ticket);

      return { message: 'Ticket booked successfully' };
    }
  }
}
