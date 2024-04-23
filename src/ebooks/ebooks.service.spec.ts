import { Test, TestingModule } from '@nestjs/testing';
import { EbooksService } from './ebooks.service';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { Wish } from './entities/wish.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EbooksService', () => {
  let service: EbooksService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Ebook),
          useValue: new RepositoryMock<Ebook>()
        },
        {
          provide: getRepositoryToken(Wish),
          useValue: {}
        },
        {
          provide: getRepositoryToken(EbooksReader),
          useValue: {}
        },
        EbooksService,
        {
          provide: AuthService,
          useValue: {
            getUserById: jest.fn().mockReturnValue({
              id: "1",
              username: "user",
              password: "password",
              email: "email@domain.com",
              role: "Author",
            }),
            getAuthorByUser: jest.fn().mockReturnValue({
              id: "1",
              userId: "1",
              penName: "a",
              biography: "a",
              booksWritten: "a",
            })
          },
        },
      ],
    }).compile();

    service = module.get<EbooksService>(EbooksService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an ebook given valid data', async () => {
    const ebook = await service.create({
      title: "123",
      publisher: "a",
      author: "90f68e83-ee89-4739-9682-c2c803748f36",
      overview: "a",
      price: 1,
      stock: 2,
      fileData: ""
    });

    expect(ebook).toBeDefined();
  });

  it('should not create an ebook given valid data', async () => {
    const ebook = await service.create({
      title: "123",
      publisher: "a",
      author: "90f68e83-ee89-4739-9682-c2c803748f36",
      overview: "a",
      price: 1,
      stock: 2,
      fileData: ""
    });

    expect(ebook).toBeDefined();
  });
});

import { Repository } from 'typeorm';

class RepositoryMock<T> {
  data = []

  async findOne(query): Promise<T> {
    const q = query.where;
    return this.data.find((i) => Object.entries(q).map((k,v) => i[k.toString()]==v).every((v) => v == true))
  }

  create(createDto) {
    const newObj = {...createDto, id: "57f3eb18-fc47-4bce-b9ca-45a2369a0b44"};
    return newObj;
  }

  save(newObj) {
    this.data.push(newObj);
  }
}