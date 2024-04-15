import { AppDataSource } from '../data-source';
import { Task, TaskStatus } from '../entities';

type GetTasksServiceResponse = {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  tasks: Task[];
}

export class GetTasksService {
  async execute(userId: number, page: number, itemsPerPage: number, statuses?: TaskStatus[]): Promise<GetTasksServiceResponse> {
    try {
      const repository = AppDataSource.getRepository(Task);
      const startIndex = (page - 1) * itemsPerPage;

      const queryBuilder = repository.createQueryBuilder('task')
        .innerJoin('task.taskPermissions', 'permission')
        .where('permission.userId = :userId', { userId })
        .skip(startIndex)
        .take(itemsPerPage);

      if (statuses && statuses.length > 0) {
        queryBuilder.andWhere('task.status IN (:...statuses)', { statuses });
      }

      const [tasks, totalItems] = await Promise.all([
        queryBuilder.getMany(),
        queryBuilder.getCount(),
      ]);

      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return {
        page,
        itemsPerPage,
        totalItems,
        totalPages,
        tasks,
      };
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
