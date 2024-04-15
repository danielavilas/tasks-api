import { CreateLoginService } from '../services/CreateLoginService';
import { taskResolvers } from './taskResolvers';

export const resolvers = {
  Query: {
    ...taskResolvers.Query,
  },
  Mutation: {
    ...taskResolvers.Mutation,
    login: async (_, { username, password }: { username: string, password: string }) => {
      const createLoginService = new CreateLoginService();
      const accessToken = await createLoginService.execute(username, password);

      return { accessToken };
    },
  }
};
