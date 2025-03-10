import { DataSource } from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { ENV } from '../constants/env.constant';
import { Venue } from '../modules/venue/entities/venue.entity';
import { Event } from '../modules/event/entities/event.entity';
import { Notification } from '../modules/notification/entities/notification.entity';
import { Booking } from '../modules/booking/entities/booking.entity';
import { EventTicket } from '../modules/event/entities/event-ticket.entity';
export const dataSource = new DataSource({
  type: 'postgres',
  host: ENV.PSQL.HOST,
  port: ENV.PSQL.PORT,
  username: ENV.PSQL.USERNAME,
  password: ENV.PSQL.PASSWORD,
  database: ENV.PSQL.DATABASE,
  entities: [User, Venue, Event, Notification, Booking, EventTicket],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
