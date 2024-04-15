import jwt from 'jsonwebtoken';
import { AuthService } from './AuthService';

describe('AuthService', () => {
  const invalidToken = 'invalid_token';
  const SECRET_KEY = process.env.AUTH_SECRET_KEY as string;

  it('should decode a valid token and return the userId', async () => {
    const authService = new AuthService();
    const userId = 'user_id';
    const encodedToken = jwt.sign({ userId }, SECRET_KEY);

    const decodedToken = await authService.execute(encodedToken);

    expect(decodedToken.userId).toEqual(userId);
  });

  it('should throw an error for an invalid token', async () => {
    const authService = new AuthService();

    try {
      await authService.execute(invalidToken);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
