import { GraphQLError } from 'graphql';
import { TaskStatus } from '../entities';
import { CreateLoginService } from '../services/CreateLoginService';
import { GetTaskService } from '../services/GetTaskService';
import { GetTasksService } from '../services/GetTasksService';

const taskResolvers = {
  task: async (_, { id }: { id: number }, { userId }) => {
    try {
      if (!userId) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },  
          },
        });
      }

      const getTaskService = new GetTaskService();

      const result = await getTaskService.execute(id, userId);

      return result;
    } catch (error) {
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
    if (!userId) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },  
        },
      });
    }

    if (page <= 0 || itemsPerPage <= 0) {
      throw new Error('page and itemsPerPage must be greater than zero');
    }

    const getTasksService = new GetTasksService();

    const result = await getTasksService.execute(userId, page,itemsPerPage, statuses);

    return result;
  }
};

export const resolvers = {
  Query: {
    ...taskResolvers,
  },
  Mutation: {
    login: async (_, { username, password }: { username: string, password: string }) => {
      const createLoginService = new CreateLoginService();
      const accessToken = await createLoginService.execute(username, password);

      return { accessToken };
    },
  }
};
