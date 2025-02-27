import { User } from 'src/modules/auth/entities/user.entity';
import { BaseEntity } from 'src/universal/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false })
  user: User;
}
