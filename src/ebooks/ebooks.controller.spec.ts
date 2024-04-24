import { Test, TestingModule } from '@nestjs/testing';
import { EbooksController } from './ebooks.controller';
import { EbooksService } from './ebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { Wish } from './entities/wish.entity';
import { AuthService } from '../auth/auth.service';
import { Author } from '../auth/entities/user.entity';
import { InfoEbookDto } from './dto/info-ebook.dto';
import { VisualizeEbookDto } from './dto/visualize-ebook.dto';

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
}

describe('EbooksController', () => {
  let controller: EbooksController;
  let ebooksService: EbooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbooksController],
      providers: [
        {
          provide: EbooksService,
          useValue: {
            findById: jest.fn()
          }
        },
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
    ebooksService = module.get<EbooksService>(EbooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get basic info of a valid ebook', async () => {
    jest.spyOn(ebooksService, 'findById').mockImplementation(async() => {return createdEbook});
  
    const info: InfoEbookDto = await controller.findById("10f68e83-ee89-4739-9682-c2c803748f36");
    expect(info).toEqual(createdEbookDto);
  });

  it('should get ebook filedata of a valid ebook', async () => {
    jest.spyOn(ebooksService, 'findById').mockImplementation(async() => {return createdEbook});
  
    const info: VisualizeEbookDto = await controller.visualizeById("10f68e83-ee89-4739-9682-c2c803748f36");
    expect(info).toEqual(createdEbookDto2);
  });
});

const author: Author = new Author();

author.id = "90f68e83-ee89-4739-9682-c2c803748f36"
author.penName = "90f68e83-ee89-4739-9682-c2c803748f36"

const createdEbook: Ebook = {
  id: "10f68e83-ee89-4739-9682-c2c803748f36",
  title: "The title",
  publisher: "a",
  author: author,
  overview: "a",
  price: 1,
  stock: 2,
  fileData: new Uint8Array(5)
}

const createdEbookDto: InfoEbookDto = {
  title: "The title",
  publisher: "a",
  author: "90f68e83-ee89-4739-9682-c2c803748f36",
  overview: "a",
  price: 1,
  stock: 2
}

const createdEbookDto2: VisualizeEbookDto = {
  title: "The title",
  fileData: "AAAAAAA="
}

