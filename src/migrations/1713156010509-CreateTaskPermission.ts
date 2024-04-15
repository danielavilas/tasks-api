import { MigrationInterface, QueryRunner } from "typeorm";
import { Task, TaskStatus, User } from "../entities";
import { TaskPermission } from "../entities";

export class CreateTaskPermission1713156010509 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const daniel = await queryRunner.manager.findOneOrFail(User, { where: { username: 'daniel' } });
    const avila = await queryRunner.manager.findOneOrFail(User, { where: { username: 'avila' } });

    const tasks = await queryRunner.manager.find(Task);
    const danielPermissions = tasks.map(task => {
      const taskPermission = new TaskPermission();
      taskPermission.task = task;
      taskPermission.user = daniel;
      return taskPermission
    });
    await queryRunner.manager.getRepository(TaskPermission).save(danielPermissions);

    const todoTasks = await queryRunner.manager.find(Task, { where: { status: TaskStatus.TODO } });
    const avilaPermissions = todoTasks.map(task => {
      const taskPermission = new TaskPermission();
      taskPermission.task = task;
      taskPermission.user = avila;
      return taskPermission
    });
    await queryRunner.manager.getRepository(TaskPermission).save(avilaPermissions);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM task_permission');
  }
}
