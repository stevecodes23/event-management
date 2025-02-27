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
import * as ejs from 'ejs';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
@Injectable()
export class BookingService {
  private stripe: Stripe | null = null;

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(EventTicket)
    private readonly eventTicketRepository: Repository<EventTicket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>(ENV.STRIPE.KEY);

    if (!stripeKey) {
      console.warn('⚠️ STRIPE_KEY is missing. Stripe is disabled.');
      return;
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia',
    });
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

    const payment = await this.stripe?.charges.create({
      amount: totalAmount,
      currency: 'inr',
      source: paymentToken,
      description: `Payment for ${quantity} tickets to ${ticket.event.title}`,
    });

    if (!payment?.paid) {
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
  async getUserBookings(userId: number) {
    return await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['ticket', 'ticket.event', 'ticket.event.venue'],
      select: {
        id: true,
        quantity: true,
        totalPrice: true,
        paymentStatus: true,
        ticket: {
          id: true,
          type: true,
          price: true,
          event: {
            id: true,
            title: true,
            date: true,
            startTime: true,
            endTime: true,
            venue: {
              id: true,
              address: true,
              city: true,
              state: true,
            },
          },
        },
      },
    });
  }

  async generateTicket(userId: number, bookingId: number): Promise<Buffer> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, user: { id: userId } },
      relations: ['user', 'ticket', 'ticket.event', 'ticket.event.venue'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    const templatePath = path.join(
      __dirname,
      '../../../template/ticket-template.ejs',
    );
    const html = await ejs.renderFile(templatePath, {
      booking,
      ticket: booking.ticket,
      event: booking.ticket.event,
      user: booking.user,
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4' }));
    await browser.close();
    return pdfBuffer;
  }
}
