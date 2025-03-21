import { Venue } from '../../venue/entities/venue.entity';
import { Event } from '../../event/entities/event.entity';

import { BaseEntity } from '../../../universal/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { Notification } from '../../notification/entities/notification.entity';
export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
  ORGANISER = 'Organiser',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, unique: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Venue, (venue) => venue.addedBy)
  venuesAdded: Venue[];

  @OneToMany(() => Venue, (venue) => venue.deletedBy)
  venuesDeleted: Venue[];

  @OneToMany(() => Event, (event) => event.organiser)
  organizedEvents: Event[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
