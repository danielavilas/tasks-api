import { GraphQLError } from 'graphql';
import { AppDataSource } from '../data-source';
import { Task, TaskPermission } from '../entities';

export class GetTaskService {
  async execute(id: number, userId: number): Promise<Task | null> {
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

      return task;
    } catch (error) {
      throw error;
    }
  }
}
