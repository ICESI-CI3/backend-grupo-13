import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, Reader, Author } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Reader),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  function mockRepository() {
    return {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
  }
  
  type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('LoginUserDto Validation', () => {
    it('should validate the DTO successfully with correct data', async () => {
      const loginUserDto = plainToClass(LoginUserDto, {
        email: 'test@example.com',
        password: 'Valid123'
      });
  
      const errors = await validate(loginUserDto);
      expect(errors.length).toBe(0);
    });
  
    it('should fail validation if password does not meet complexity requirements', async () => {
      const loginUserDto = plainToClass(LoginUserDto, {
        email: 'test@example.com',
        password: 'invalid'
      });
  
      const errors = await validate(loginUserDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toEqual(expect.objectContaining({
        matches: 'The password must have an Uppercase letter, a lowercase letter, and a number'
      }));
    });
  });

  describe('login', () => {
    it('should return a JWT token if credentials and DTO are valid', async () => {
      const mockUser = { id: '4908705d-b880-467d-9ad6-f81b0138d8ba', username: 'test', password: '$2b$10$hash'};
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
  
      const result = await service.login({
        email: 'test@example.com',
        password: 'Valid123'
      });
      expect(result).toEqual({ access_token: 'mockedJwtToken' });
    });
  
    it('should throw UnauthorizedException if credentials are invalid', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.login({
        email: 'wrong@example.com',
        password: 'Valid123'
      })).rejects.toThrow(UnauthorizedException);
    });
  
    it('should throw an exception if DTO does not pass validation', async () => {
      await expect(service.login({
        email: 'wrong@example.com',
        password: 'short'
      })).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    it('should successfully create a user and return a JWT token', async () => {
      const mockUser = { id: '4908705d-b880-467d-9ad6-f81b0138d8ba', username: 'testUser', role: 'Reader' };
      userRepository.create = jest.fn().mockReturnValue(mockUser);
      userRepository.save = jest.fn().mockResolvedValue(mockUser);
      bcrypt.hashSync = jest.fn().mockReturnValue('hashedPassword');
  
      const result = await service.createUser({
        username: 'testUser',
        password: 'password',
        email: 'test@user.com',
        role: 'Reader',
        favoriteGenre: 'Fantasy',
        bookList: ""
      });
      expect(result).toEqual({ access_token: 'mockedJwtToken' });
      expect(userRepository.create).toHaveBeenCalledWith(expect.any(Object));
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
    });
  
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: '4908705d-b880-467d-9ad6-f81b0138d8ba', username: 'testUser', role: 'Author' };
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
  
      const result = await service.getUserById('4908705d-b880-467d-9ad6-f81b0138d8ba');
      expect(result).toEqual(mockUser);
    });
  
    it('should throw NotFoundException if no user is found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.getUserById('9808705d-b880-467d-9ad6-f81b0138d8as')).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('findByUsername', () => {
    it('should return a user if the username is found', async () => {
      const mockUser = { id: '4908705d-b880-467d-9ad6-f81b0138d8ba', username: 'testUser' };
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
  
      const result = await service.findByUsername('testUser');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testUser' } });
    });
  
    it('should return null if no user is found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
  
      const result = await service.findByUsername('nonExistingUser');
      expect(result).toBeNull();
    });
  });
  
  describe('update', () => {
    it('should update a user successfully', async () => {
      const mockUser = { id: '4908705d-b880-467d-9ad6-f81b0138d8ba', username: 'originalUser' };
      const updateUserDto = { username: 'updatedUser' };
      userRepository.findOne= jest.fn().mockResolvedValue(mockUser);
      userRepository.save= jest.fn().mockImplementation((user) => Promise.resolve({ ...user }));
  
      const result = await service.update('4908705d-b880-467d-9ad6-f81b0138d8ba', updateUserDto);
      expect(result.username).toEqual('updatedUser');
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
    });
  
    it('should throw NotFoundException if the user does not exist', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.update('4908705d-b880-467d-9ad6-f81b0138d8ba', { username: 'updatedUser' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should successfully delete a user', async () => {
      const deleteResult = { affected: 1 } as DeleteResult;
      userRepository.delete = jest.fn().mockResolvedValue(deleteResult);
  
      const result = await service.remove('4908705d-b880-467d-9ad6-f81b0138d8ba');
      expect(result).toEqual(deleteResult);
    });
  
    it('should throw NotFoundException if no user is found to delete', async () => {
      const deleteResult = { affected: 0 } as DeleteResult;
      userRepository.delete= jest.fn().mockResolvedValue(deleteResult);
  
      await expect(service.remove('4908705d-b880-467d-9ad6-f81b0138d8ba')).rejects.toThrow(NotFoundException);
    });
  });
  
  

});
