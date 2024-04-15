import { GraphQLError } from 'graphql';
import { AppDataSource } from '../data-source';
import { Task, TaskPermission } from '../entities';

export class UpdateTaskService {
  async execute(id: number, data: Partial<Task>, userId: number): Promise<Task | null> {
    try {
      const taskRepository = AppDataSource.getRepository(Task);
      const taskPermissionRepository = AppDataSource.getRepository(TaskPermission);

      const [task, taskPermission] = await Promise.all([
        taskRepository.findOneBy({ id }),
        taskPermissionRepository.findOne({
          where: {
            task: { id },
            user: { id: userId },
          },
        }),
      ]);

      if (task && !taskPermission) {
        throw new GraphQLError('User is not authorized to access this resource.', {
          extensions: {
            code: 'UNAUTHORIZED',
            http: { status: 403 },  
          },
        });
      }

      if (!task) {
        throw new GraphQLError('Task not found.', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },  
          },
        });
      }

      if (data.title) {
        task.title = data.title;
      }

      if (data.description) {
        task.description = data.description;
      }

      if (data.status) {
        task.status = data.status;
      }

      await taskRepository.save(task);

      return task;
    } catch (error) {
      throw error;
    }
  }
}
