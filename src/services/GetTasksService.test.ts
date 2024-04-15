import { GetTasksService } from './GetTasksService';
import { Task, TaskStatus } from '../entities';
import { AppDataSource } from '../data-source';

describe('GetTasksService', () => {
  it('should return tasks with pagination', async () => {
    const mockTasks = [new Task(), new Task()];

    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockTasks),
      getCount: jest.fn().mockResolvedValue(10),
    };

    const getRepositorySpy = jest.spyOn(AppDataSource, 'getRepository');
    getRepositorySpy.mockReturnValue(mockRepository as any);

    const service = new GetTasksService();
    const result = await service.execute(1, 2, 5);

    expect(getRepositorySpy).toHaveBeenCalledWith(Task);
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('task');
    expect(mockRepository.innerJoin).toHaveBeenCalledWith('task.taskPermissions', 'permission');
    expect(mockRepository.where).toHaveBeenCalledWith('permission.userId = :userId', { userId: 1 });
    expect(mockRepository.skip).toHaveBeenCalledWith(5);
    expect(mockRepository.take).toHaveBeenCalledWith(5);
    expect(mockRepository.getMany).toHaveBeenCalled();
    expect(mockRepository.getCount).toHaveBeenCalled();

    expect(result).toEqual({
      page: 2,
      itemsPerPage: 5,
      totalItems: 10,
      totalPages: 2,
      tasks: mockTasks,
    });
  });
});
