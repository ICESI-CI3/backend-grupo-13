import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RoleEnum } from './enum/role.enum';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = { sign: () => 'mockToken' };
  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
    
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
       /* {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },*/

      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', () => {
    const dto = { username: 'John Doe', password: 'password', email: 'doe@jhon.com', role: 'Reader' };
    expect(service.createUser(dto)).toEqual({
      id: expect.any(Number),
      username: 'John Doe',
      email:'doe@jhon.com',
      role: RoleEnum.USER
    });
  });

});
