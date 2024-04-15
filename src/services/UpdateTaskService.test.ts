import { GraphQLError } from 'graphql';
import { UpdateTaskService } from './UpdateTaskService';
import { Task, TaskPermission, TaskStatus, TaskHistory } from '../entities';
import { AppDataSource } from '../data-source';

describe('UpdateTaskService', () => {
  it('should update task if user has permission', async () => {
    const mockTask = new Task();
    mockTask.id = 1;
    mockTask.title = 'Mock Task';
    mockTask.description = 'Mock Task Description';
    mockTask.status = TaskStatus.TODO;

    const mockTaskPermission = new TaskPermission();
    mockTaskPermission.id = 1;
    mockTaskPermission.user = { id: 1 } as any;
    mockTaskPermission.task = mockTask;

    const mockTaskRepository = {
      findOneBy: jest.fn().mockResolvedValue(mockTask),
      save: jest.fn().mockResolvedValue(mockTask),
    };

    const mockTaskPermissionRepository = {
      findOne: jest.fn().mockResolvedValue(mockTaskPermission),
    };

    const mockTaskHistoryRepository = {
      save: jest.fn().mockResolvedValue(new TaskHistory()),
    };

    jest.spyOn(AppDataSource, 'getRepository')
      .mockReturnValueOnce(mockTaskRepository as any)
      .mockReturnValueOnce(mockTaskPermissionRepository as any)
      .mockReturnValueOnce(mockTaskHistoryRepository as any);

    const service = new UpdateTaskService();

    const updatedTask = await service.execute(1, { title: 'Updated Task' }, 1);

    expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockTaskPermissionRepository.findOne).toHaveBeenCalledWith({
      where: {
        task: { id: 1 },
        user: { id: 1 },
      },
    });

    expect(updatedTask).toEqual(expect.objectContaining({
      id: 1,
      title: 'Updated Task',
      description: 'Mock Task Description',
      status: TaskStatus.TODO,
    }));
    expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
  });

  it('should throw error if user does not have permission', async () => {
    const mockTask = new Task();
    mockTask.id = 1;

    const mockTaskRepository = {
      findOneBy: jest.fn().mockResolvedValue(mockTask),
    };

    const mockTaskPermissionRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    jest.spyOn(AppDataSource, 'getRepository')
      .mockReturnValueOnce(mockTaskRepository as any)
      .mockReturnValueOnce(mockTaskPermissionRepository as any);

    const service = new UpdateTaskService();

    await expect(service.execute(1, { title: 'Updated Task' }, 1)).rejects.toThrow(GraphQLError);
  });

  it('should throw error if task not found', async () => {
    const mockTaskRepository = {
      findOneBy: jest.fn().mockResolvedValue(null),
    };

    const mockTaskPermissionRepository = {
      findOne: jest.fn().mockResolvedValue(new TaskPermission()), // Simulate TaskPermission found
    };

    jest.spyOn(AppDataSource, 'getRepository')
      .mockReturnValueOnce(mockTaskRepository as any)
      .mockReturnValueOnce(mockTaskPermissionRepository as any);

    const service = new UpdateTaskService();

    await expect(service.execute(1, { title: 'Updated Task' }, 1)).rejects.toThrow(GraphQLError);
  });
});
