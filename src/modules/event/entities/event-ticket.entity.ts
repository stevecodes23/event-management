import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Event } from './event.entity';
import { Booking } from 'src/modules/booking/entities/booking.entity';

export enum TicketType {
  VIP = 'VIP',
  GENERAL = 'General',
  EARLY_BIRD = 'Early Bird',
}

@Entity()
export class EventTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TicketType })
  type: TicketType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  totalQuantity: number;

  @Column({ type: 'int', default: 0 })
  soldQuantity: number;

  @Column({ type: 'int', default: 0 })
  reservedQuantity: number;

  @ManyToOne(() => Event, (event) => event.tickets, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => Booking, (booking) => booking.ticket)
  bookings: Booking[];
}
