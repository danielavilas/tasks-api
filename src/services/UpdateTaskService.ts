import { GraphQLError } from 'graphql';
import { AppDataSource } from '../data-source';
import { Task, TaskHistory, TaskPermission, TaskState } from '../entities';

export class UpdateTaskService {
  async execute(id: number, data: Partial<Task>, userId: number): Promise<Task | null> {
    try {
      const taskRepository = AppDataSource.getRepository(Task);
      const taskPermissionRepository = AppDataSource.getRepository(TaskPermission);
      const taskHistoryRepository = AppDataSource.getRepository(TaskHistory);

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

      const previousState: TaskState = Object.assign({}, {
        status: task.status,
        title: task.title,
        description: task.description,
      });
      let hasUpdated = false;

      if (data.title && data.title !== task.title) {
        task.title = data.title;
        hasUpdated = true;
      }

      if (data.description && data.description !== task.description) {
        task.description = data.description;
        hasUpdated = true;
      }

      if (data.status && data.status !== task.status) {
        task.status = data.status;
        hasUpdated = true;
      }

      if (hasUpdated) {
        await taskRepository.save(task);

        const history = new TaskHistory();
        history.taskId = task.id;
        history.userId = userId;
        history.previousState = previousState;
        history.newState = {
          title: task.title,
          description: task.description,
          status: task.status,
        };
        await taskHistoryRepository.save(history);
      }

      return task;
    } catch (error) {
      throw error;
    }
  }
}
