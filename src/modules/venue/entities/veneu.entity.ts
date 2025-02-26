import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/universal/base.entity';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity()
export class Venue extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ type: 'int' })
  capacity: number;

  @ManyToOne(() => User, (user) => user.venuesAdded, { nullable: true })
  addedBy: User;

  @ManyToOne(() => User, (user) => user.venuesDeleted, { nullable: true })
  deletedBy: User;

  @ManyToOne(() => Event, (event) => event.venue)
  events: Event[];

}
