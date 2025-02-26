import { BaseEntity } from 'src/universal/base.entity';
import { Entity, Column } from 'typeorm';
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
}
