import { GraphQLError } from 'graphql';
import { AppDataSource } from '../data-source';
import { TaskHistory, TaskPermission } from '../entities';

export class GetTaskHistoryService {
  async execute(id: number, userId: number): Promise<TaskHistory[]> {
    try {
      const taskHistoryRepository = AppDataSource.getRepository(TaskHistory);
      const taskPermissionRepository = AppDataSource.getRepository(TaskPermission);

      const taskPermission = await taskPermissionRepository.findOne({
        where: {
          task: { id },
          user: { id: userId },
        },
      });

      if (!taskPermission) {
        throw new GraphQLError('User is not authorized to access this resource.', {
          extensions: {
            code: 'UNAUTHORIZED',
            http: { status: 403 },  
          },
        });
      }

      const history = await taskHistoryRepository.findBy({
        taskId: id,
      });

      return history;
    } catch (error) {
      throw error;
    }
  }
}
