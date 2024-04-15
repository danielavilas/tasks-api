import { GetTaskService } from './GetTaskService';
import { Task, TaskPermission } from '../entities';
import { GraphQLError } from 'graphql';
import { AppDataSource } from '../data-source';

describe('GetTaskService', () => {
  it('should return task if user has permission', async () => {
    const findOneByMock = jest.fn().mockResolvedValueOnce(new Task());
    const findOneMock = jest.fn().mockResolvedValueOnce(new TaskPermission());

    const getRepositorySpy = jest.spyOn(AppDataSource, 'getRepository');
    getRepositorySpy
      .mockReturnValueOnce({ findOneBy: findOneByMock } as any)
      .mockReturnValueOnce({ findOne: findOneMock } as any);

    const service = new GetTaskService();

    const result = await service.execute(1, 1);

    expect(getRepositorySpy).toHaveBeenCalledWith(Task);
    expect(getRepositorySpy).toHaveBeenCalledWith(TaskPermission);
    expect(findOneByMock).toHaveBeenCalledWith({ id: 1 });
    expect(findOneMock).toHaveBeenCalledWith({
      where: {
        task: { id: 1 },
        user: { id: 1 },
      },
    });

    expect(result).toEqual(expect.any(Task));
  });

  it('should throw error if user does not have permission', async () => {
    const findOneByMock = jest.fn().mockResolvedValueOnce(new Task());
    const findOneMock = jest.fn().mockResolvedValueOnce(null);

    const getRepositorySpy = jest.spyOn(AppDataSource, 'getRepository');
    getRepositorySpy
      .mockReturnValueOnce({ findOneBy: findOneByMock }  as any)
      .mockReturnValueOnce({ findOne: findOneMock }  as any);

    const service = new GetTaskService();

    await expect(service.execute(1, 1)).rejects.toThrow(GraphQLError);
  });
});
