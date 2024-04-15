import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.AUTH_SECRET_KEY as string;

export class AuthService {
  async execute(token: string): Promise<{ userId: string }> {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  }
}
