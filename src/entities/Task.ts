import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { TaskPermission } from './TaskPermission';
import { TaskHistory } from './TaskHistory';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @Index()
  status: TaskStatus;

  @OneToMany(() => TaskPermission, taskPermission => taskPermission.task)
  taskPermissions: TaskPermission[];

  @OneToMany(() => TaskHistory, taskHistory => taskHistory.task)
  taskHistory: TaskHistory[];
}
