import { Test, TestingModule } from '@nestjs/testing';
import { EbooksService } from './ebooks.service';
import { AuthService } from '../auth/auth.service';

describe('EbooksService', () => {
  let service: EbooksService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
      author: "a",
      overview: "a",
      price: 1,
      stock: 2,
      fileData: ""
    });

    expect(ebook).toBeDefined();
  });
});
