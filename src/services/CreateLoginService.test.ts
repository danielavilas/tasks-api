import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../entities';
import { AppDataSource } from '../data-source';
import { CreateLoginService } from './CreateLoginService';
import { GraphQLError } from 'graphql';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_token'),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

describe('CreateLoginService', () => {
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an access token when user is authenticated', async () => {
    const userData = new User();
    userData.id = 1;
    userData.username = 'testuser';
    userData.password = 'hashedpassword';

    mockUserRepository.findOne.mockResolvedValue(userData);

    const service = new CreateLoginService();

    const accessToken = await service.execute('testuser', 'password');

    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
    expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'jest-secret', { expiresIn: '24h' });

    expect(accessToken).toBe('mocked_token');
  });

  it('should throw an error when user is not authenticated', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const service = new CreateLoginService();

    await expect(service.execute('testuser', 'password')).rejects.toThrow(GraphQLError);
  });
});
