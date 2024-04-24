import { Test, TestingModule } from '@nestjs/testing';
import { EbooksController } from './ebooks.controller';
import { EbooksService } from './ebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { Wish } from './entities/wish.entity';
import { AuthService } from '../auth/auth.service';

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
}

describe('EbooksController', () => {
  let controller: EbooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbooksController],
      providers: [
        EbooksService,
        {
          provide: getRepositoryToken(Ebook),
          useValue: mockRepo
        },
        {
          provide: getRepositoryToken(Wish),
          useValue: mockRepo
        },
        {
          provide: getRepositoryToken(EbooksReader),
          useValue: mockRepo
        },
        {
          provide: AuthService,
          useValue: {
            getUserById: jest.fn().mockReturnValue({
              id: "10A68e83-ee89-4739-9682-c2c803748f36",
              username: "user",
              password: "password",
              email: "email@domain.com",
              role: "Author",
            }),
            getAuthorByUser: jest.fn().mockReturnValue({
              id: "10B68e83-ee89-4739-9682-c2c803748f36",
              userId: "1",
              penName: "Author...",
              biography: "Not that interesting",
              booksWritten: "20",
            })
          },
        }]
    }).compile();

    controller = module.get<EbooksController>(EbooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
