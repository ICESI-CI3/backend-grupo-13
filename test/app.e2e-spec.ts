import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { RolesGuard } from '../src/auth/guard/roles.guard';
import { RoleEnum } from '../src/auth/enum/role.enum';
import { EbooksService } from '../src/ebooks/ebooks.service';
import { EbooksController } from '../src/ebooks/ebooks.controller';
import { DeleteResult } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
        {
          provide: AuthGuard('jwt'),
          useValue: { canActivate: () => true },
        },
        {
          provide: RolesGuard,
          useValue: { canActivate: () => true },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const createUserDto = { username: 'test', password: 'Password123', roles: ['admin'] };
    const expectedResponse = { access_token: 'someToken' };
  
    authService.createUser= jest.fn().mockResolvedValue(expectedResponse);
  
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(201)
      .expect(expectedResponse);
  });

  it('should login a user', async () => {
    const loginUserDto = { username: 'test', password: 'Password123' };
    const expectedResponse = { access_token: 'someToken' };
  
    authService.login= jest.fn().mockResolvedValue(expectedResponse);
  
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserDto)
      .expect(201)
      .expect(expectedResponse);
  });
  
  it('should get all users for admin', async () => {
    const users = [{ username: 'user1' }, { username: 'user2' }];
    authService.getAllUsers = jest.fn().mockResolvedValue(users);

    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      {
        sub: '4908705d-b880-467d-9ad6-f81b0138d8ba',
        username: 'admin',
        role: RoleEnum.ADMIN
      },
      'clave_secreta',
      { expiresIn: '1h' }
    );
    
    await request(app.getHttpServer())
      .get('/auth/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(users); 
  });
  
  it('should update a user', async () => {
    const updateUserDto = { username: 'updatedUser' };
    const updatedUser = { id: '1', username: 'updatedUser' };
  
    authService.getUserById = jest.fn().mockResolvedValue(updatedUser);
    authService.update= jest.fn().mockResolvedValue(updatedUser);

    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      {
        sub: '4908705d-b880-467d-9ad6-f81b0138d8ba',
        username: 'admin',
        role: RoleEnum.ADMIN
      },
      'clave_secreta',
      { expiresIn: '1h' }
    );
  
    await request(app.getHttpServer())
      .patch('/auth/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updateUserDto)
      .expect(200)
      .expect(updatedUser);
  });
  
});

describe('EbooksController (e2e)', () => {
  let app: INestApplication;
  let ebooksService: EbooksService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EbooksController],
      providers: [
        {
          provide: EbooksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            assignEbookToReader: jest.fn(),
            findAllEbooksByReader: jest.fn(),
            findByTitle: jest.fn(),
          },
        },
        {
          provide: AuthGuard('jwt'),
          useValue: { canActivate: () => true },
        },
        {
          provide: RolesGuard,
          useValue: { canActivate: () => true },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    ebooksService = moduleFixture.get<EbooksService>(EbooksService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /ebooks - should create an ebook', async () => {
    const newEbookDto = {
      title: "Example Book",
      publisher: "Example Publisher",
      author: "Author Name",
      overview: "Detailed description of the book",
      price: 19.99,
      stock: 100
    };

    const expectedEbook = {
      ...newEbookDto,
      id: "4908705d-b880-467d-9ad6-f81b0138d8bc",
    };

    ebooksService.create = jest.fn().mockResolvedValue(expectedEbook);

    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      {
        sub: '4908705d-b880-467d-9ad6-f81b0138d8ba',
        username: 'Author',
        role: RoleEnum.AUTHOR
      },
      'clave_secreta',
      { expiresIn: '1h' }
    );
  

    await request(app.getHttpServer())
      .post('/ebooks')
      .set('Authorization', `Bearer ${token}`)
      .send(newEbookDto)
      .expect(201)
      .expect(expectedEbook);
  });

  it('GET /ebooks', async () => {
    const ebooks = [{ title: 'Book 1' }, { title: 'Book 2' }];
    ebooksService.findAll= jest.fn().mockResolvedValue(ebooks);

    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      {
        sub: '4908705d-b880-467d-9ad6-f81b0138d8ba',
        username: 'Author',
        role: RoleEnum.AUTHOR
      },
      'clave_secreta',
      { expiresIn: '1h' }
    );
  
  
    await request(app.getHttpServer())
      .get('/ebooks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(ebooks);
  });

  it('GET /ebooks/info/:id', async () => {
    const author = { id:"4908705d-b880-467d-9ad6-f81b0138d8bh", userId: "4908705d-b880-467d-9ad6-f81b0138d8ba",penName: "Author",biography: "string",booksWritten: "string"}
    const ebookInfo = { title: 'Book 1', publisher: 'Publisher', author: author, overview: 'Overview', price: 30, stock: 15 };
    const expected = {title: 'Book 1', publisher: 'Publisher', author: author.penName, overview: 'Overview', price: 30, stock: 15 }
    ebooksService.findById= jest.fn().mockResolvedValue(ebookInfo);
    
    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      {
        sub: '4908705d-b880-467d-9ad6-f81b0138d8ba',
        username: 'Author',
        role: RoleEnum.AUTHOR
      },
      'clave_secreta',
      { expiresIn: '1h' }
    );

    await request(app.getHttpServer())
      .get('/ebooks/info/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(expected);
  });
  
  it('PATCH /ebooks/visualize/:id', async () => {
    const ebookUpdateDto = {
      id: "4908705d-b880-467d-9ad6-f81b0138d8bh",
      title: "Example Book",
      publisher: "Example Publisher",
      author: "Author Name",
      overview: "Detailed description of the book",
      price: 19.99,
      stock: 100
    };
    const updatedEbook = { ...ebookUpdateDto, description: 'Updated Description', price: 25 };
    ebooksService.update = jest.fn().mockResolvedValue(updatedEbook);
    ebooksService.findById = jest.fn().mockResolvedValue(ebookUpdateDto);
    
    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      {
        sub: '4908705d-b880-467d-9ad6-f81b0138d8ba',
        username: 'Author',
        role: RoleEnum.AUTHOR
      },
      'clave_secreta',
      { expiresIn: '1h' }
    );

    await request(app.getHttpServer())
      .patch('/ebooks/visualize/4908705d-b880-467d-9ad6-f81b0138d8bh')
      .set('Authorization', `Bearer ${token}`)
      .send(ebookUpdateDto)
      .expect(200)
      .expect(updatedEbook);
  });

  it('DELETE /ebooks/:id', async () => {
    const deleteResult = { affected: 1 } as DeleteResult;
    const ebook = {
      id: "4908705d-b880-467d-9ad6-f81b0138d8bc",
      title: "Example Book",
      publisher: "Example Publisher",
      author: "Author Name",
      overview: "Detailed description of the book",
      price: 19.99,
      stock: 100
    };
    ebooksService.remove = jest.fn().mockResolvedValue(deleteResult);
    ebooksService.findById = jest.fn().mockResolvedValue(ebook)

    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      {
        sub: '4908705d-b880-467d-9ad6-f81b0138d8ba',
        username: 'Author',
        role: RoleEnum.AUTHOR
      },
      'clave_secreta',
      { expiresIn: '1h' }
    );
  
    await request(app.getHttpServer())
      .delete('/ebooks/4908705d-b880-467d-9ad6-f81b0138d8bc')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(deleteResult);
  });
  
});