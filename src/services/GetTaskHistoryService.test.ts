import { GetTaskHistoryService } from './GetTaskHistoryService';
import { TaskHistory, TaskPermission } from '../entities';
import { GraphQLError } from 'graphql';
import { AppDataSource } from '../data-source';

describe('GetTaskHistoryService', () => {
  it('should return task history if user has permission', async () => {
    const taskId = 1;
    const userId = 1;

    const mockTaskHistory = new TaskHistory();
    mockTaskHistory.id = 1;
    mockTaskHistory.taskId = taskId;
    mockTaskHistory.userId = userId;

    const mockTaskPermission = new TaskPermission();
    mockTaskPermission.id = 1;
    mockTaskPermission.user = { id: userId } as any;
    mockTaskPermission.task = { id: taskId } as any;

    const mockTaskHistoryRepository = {
      findBy: jest.fn().mockResolvedValue([mockTaskHistory]),
    };

    const mockTaskPermissionRepository = {
      findOne: jest.fn().mockResolvedValue(mockTaskPermission),
    };

    jest.spyOn(AppDataSource, 'getRepository')
      .mockReturnValueOnce(mockTaskHistoryRepository as any)
      .mockReturnValueOnce(mockTaskPermissionRepository as any);

    const service = new GetTaskHistoryService();

    const history = await service.execute(taskId, userId);

    expect(mockTaskPermissionRepository.findOne).toHaveBeenCalledWith({
      where: {
        task: { id: taskId },
        user: { id: userId },
      },
    });

    expect(history).toEqual([mockTaskHistory]);
  });

  it('should throw error if user does not have permission', async () => {
    const taskId = 1;
    const userId = 1;

    const mockTaskPermissionRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    jest.spyOn(AppDataSource, 'getRepository')
      .mockReturnValueOnce({} as any)
      .mockReturnValueOnce(mockTaskPermissionRepository as any);

    const service = new GetTaskHistoryService();

    await expect(service.execute(taskId, userId)).rejects.toThrow(GraphQLError);
  });
});
