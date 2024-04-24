import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleEnum } from './enum/role.enum';
import { DeleteResult } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            login: jest.fn(),
            checkAuthStatus: jest.fn(),
            getUserById: jest.fn(),
            getAllUsers: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call AuthService.createUser and return a token', async () => {
    const result = { access_token: 'some_token' };
    const createUserDto = { username: 'user', password: 'pass', email:'email', role:'Reader' };
    jest.spyOn(authService, 'createUser').mockResolvedValue(result);
  
    expect(await controller.register(createUserDto)).toBe(result);
    expect(authService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should call AuthService.login and return a token', async () => {
    const result = { access_token: 'some_token' };
    const loginUserDto = { email: 'test@test.com', password: 'password' };
    jest.spyOn(authService, 'login').mockResolvedValue(result);
  
    expect(await controller.login(loginUserDto)).toBe(result);
    expect(authService.login).toHaveBeenCalledWith(loginUserDto);
  });

  it('should retrieve a user by ID', async () => {
    const user = { id: '1', username: 'user1', password:'pass',email:'email', role: RoleEnum.USER, orders:[ ] };
    jest.spyOn(authService, 'getUserById').mockResolvedValue(user);
  
    expect(await controller.getUserById('1')).toBe(user);
    expect(authService.getUserById).toHaveBeenCalledWith('1');
  });
  
  it('should return all users', async () => {
    const users = [{ id: '1', username: 'user1', password:'pass',email:'email', role: RoleEnum.USER, orders:[ ] }, { id: '2', username: 'user2', password:'pass',email:'email2', role: RoleEnum.AUTHOR, orders:[ ] }];
    jest.spyOn(authService, 'getAllUsers').mockResolvedValue(users);
  
    expect(await controller.getAllUsers()).toBe(users);
    expect(authService.getAllUsers).toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const user = { id: '1', username: 'user1', password:'pass',email:'email', role: RoleEnum.USER, orders:[ ] };
    const updateUserDto = { username: 'updatedUser' };
    jest.spyOn(authService, 'getUserById').mockResolvedValue(user);
    jest.spyOn(authService, 'update').mockResolvedValue({ ...user, ...updateUserDto });
  
    expect(await controller.update('1', updateUserDto)).toEqual({ ...user, ...updateUserDto });
    expect(authService.update).toHaveBeenCalledWith('1', updateUserDto);
  });

  it('should remove a user', async () => {
    const deleteResult = { affected: 1 } as DeleteResult;
    jest.spyOn(authService, 'getUserById').mockResolvedValue({ id: '1', username: 'user1', password:'pass',email:'email', role: RoleEnum.USER, orders:[ ] });
    jest.spyOn(authService, 'remove').mockResolvedValue(deleteResult);
  
    expect(await controller.remove('1')).toBe(deleteResult);
    expect(authService.remove).toHaveBeenCalledWith('1');
  });
  
  
  
});
