import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { TaskPermission } from './TaskPermission';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => TaskPermission, taskPermission => taskPermission.user)
  taskPermissions: TaskPermission[];
}
