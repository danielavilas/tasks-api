import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../entities';
import { AppDataSource } from '../data-source';
import { GraphQLError } from 'graphql';

const SECRET_KEY = process.env.AUTH_SECRET_KEY as string;
const EXPIRES_IN = '1h';

export class CreateLoginService {
  async execute(username: string, password: string): Promise<any> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },  
        },
      });
    }

    const userId = user.id;
    const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: EXPIRES_IN });

    return accessToken;
  }
}
