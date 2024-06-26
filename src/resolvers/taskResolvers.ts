import { GraphQLError } from 'graphql';
import { GetTaskService } from '../services/GetTaskService';
import { TaskStatus } from '../entities';
import { GetTasksService } from '../services/GetTasksService';
import { UpdateTaskService } from '../services/UpdateTaskService';
import { GetTaskHistoryService } from '../services/GetTaskHistoryService';

const handleError = (error: unknown) => {
  if (!(error instanceof GraphQLError)) {
    console.error('An unexpected error occurred:', error);

    throw new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  }

  throw error;
}

const throwAuthError = () => {
  throw new GraphQLError('User is not authenticated', {
    extensions: {
      code: 'UNAUTHENTICATED',
      http: { status: 401 },
    },
  });
}

const taskHistoryResolver = async (_, { id }: { id: number }, { userId }) => {
  try {
    if (!userId) {
      throwAuthError();
    }

    const getTaskHistoryService = new GetTaskHistoryService();

    const result = await getTaskHistoryService.execute(id, userId);

    return result;
  } catch (error) {
    handleError(error);
  }
}

export const taskResolvers = {
  Query: {
    task: async (_, { id }: { id: number }, { userId }) => {
      try {
        if (!userId) {
          throwAuthError();
        }

        const getTaskService = new GetTaskService();

        const result = await getTaskService.execute(id, userId);

        return {
          ...result,
          taskHistory: taskHistoryResolver(_, { id }, { userId }),
        };
      } catch (error) {
        handleError(error);
      }
    },
    tasks: async (_, {
      page = 1,
      itemsPerPage = 10,
      statuses = [],
    }: {
      page?: number;
      itemsPerPage?: number;
      statuses?: TaskStatus[]; 
    }, { userId }) => {
      try {
        if (!userId) {
          throwAuthError();
        }

        if (page <= 0 || itemsPerPage <= 0) {
          throw new Error('page and itemsPerPage must be greater than zero');
        }

        const getTasksService = new GetTasksService();

        const result = await getTasksService.execute(userId, page,itemsPerPage, statuses);

        return {
          ...result,
          tasks: result.tasks.map((task) => ({
            ...task,
            taskHistory: taskHistoryResolver(_, { id: task.id }, { userId }),
          }))
        };
      } catch (error) {
        handleError(error);
      }
    },
  },
  Mutation: {
    updateTask: async (_, {
      id,
      status,
      title,
      description,
    }: {
      id: number,
      status?: TaskStatus,
      title?: string,
      description?: string,
    }, { userId }) => {
      try {
        const updateTaskService = new UpdateTaskService();
  
        const task = await updateTaskService.execute(id, {
          status,
          title,
          description,
        }, userId);
  
        return {
          ...task,
          taskHistory: taskHistoryResolver(_, { id }, { userId }),
        };
      } catch (error) {
        handleError(error);
      }
    },
  }
};