import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Task } from './Task';

export interface TaskState {
  status: string;
  title;
  description: string;
}

@Entity()
export class TaskHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  userId: number;

  @Column({ type: 'json' })
  previousState: TaskState;

  @Column({ type: 'json' })
  newState: TaskState;

  @Index('idx_task_id_created_at')
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
