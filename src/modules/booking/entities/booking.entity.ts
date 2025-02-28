import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { EventTicket } from '../../event/entities/event-ticket.entity';
import { BaseEntity } from '../../../universal/base.entity';
export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
  FAILED = 'Failed',
}
@Entity()
export class Booking extends BaseEntity {
  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => EventTicket, (ticket) => ticket.bookings, { eager: true })
  ticket: EventTicket;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: false })
  paymentStatus: PaymentStatus;
}
