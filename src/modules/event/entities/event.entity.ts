import { BaseEntity } from 'src/universal/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { EventTicket } from './event-ticket.entity';
import { Venue } from 'src/modules/venue/entities/veneu.entity';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity()
export class Event extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Venue, (venue) => venue.events, {
    nullable: false,
    eager: true,
  })
  venue: Venue;

  @ManyToOne(() => User, (user) => user.organizedEvents, {
    nullable: false,
    eager: true,
  })
  organiser: User;
  @OneToMany(() => EventTicket, (eventTicket) => eventTicket.event, {
    cascade: true,
  })
  tickets: EventTicket[];
}
