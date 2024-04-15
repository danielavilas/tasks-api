import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppDataSource } from './data-source';
import { resolvers } from './resolvers';
import { AuthService } from './services/AuthService';

const schemaPath = join(__dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf8');
const { PORT } = process.env;
const ENABLE_INSTROSPECTION = process.env.NODE_ENV !== 'production';

// move to server and user server.start();
const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  introspection: ENABLE_INSTROSPECTION,

});

(async function main() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(PORT) },
    context: async ({ req }) => {
      try {
        const token = req.headers.authorization || '';
        if (!token) return { userId: null };

        const authService = new AuthService();
        const { userId } = await authService.execute(token);

        return { userId };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();