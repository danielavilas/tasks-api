import { MigrationInterface, QueryRunner } from "typeorm";
import { Task, TaskStatus } from '../entities';

export class CreateTasks1713150753530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tasks: { title: string; description: string; status: TaskStatus }[] = [
      { title: 'Task 1', description: 'Description for Task 1', status: TaskStatus.TODO },
      { title: 'Task 2', description: 'Description for Task 2', status: TaskStatus.IN_PROGRESS },
      { title: 'Task 3', description: 'Description for Task 3', status: TaskStatus.DONE },
      { title: 'Task 4', description: 'Description for Task 4', status: TaskStatus.ARCHIVED },
      { title: 'Task 5', description: 'Description for Task 5', status: TaskStatus.TODO },
      { title: 'Task 6', description: 'Description for Task 6', status: TaskStatus.IN_PROGRESS },
      { title: 'Task 7', description: 'Description for Task 7', status: TaskStatus.DONE },
      { title: 'Task 8', description: 'Description for Task 8', status: TaskStatus.ARCHIVED },
      { title: 'Task 9', description: 'Description for Task 9', status: TaskStatus.TODO },
      { title: 'Task 10', description: 'Description for Task 10', status: TaskStatus.IN_PROGRESS },
    ];

    await queryRunner.connection
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values(tasks)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .createQueryBuilder()
      .delete()
      .from(Task)
      .execute();
  }
}
