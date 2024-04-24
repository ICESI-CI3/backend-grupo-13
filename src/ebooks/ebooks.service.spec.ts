import { Test, TestingModule } from '@nestjs/testing';
import { EbooksService } from './ebooks.service';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { Wish } from './entities/wish.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
}

describe('EbooksService', () => {
  let service: EbooksService;
  let authService: AuthService;
  let ebookRepository: Repository<Ebook>;
  let wishRepository: Repository<Wish>;
  let ebooksReaderRepository: Repository<EbooksReader>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        EbooksService,
        {
          provide: AuthService,
          useValue: {
            getUserById: jest.fn((value) => value).mockReturnValue({
              id: "1",
              username: "user",
              password: "password",
              email: "email@domain.com",
              role: "Author",
            }),
            getAuthorByUser: jest.fn((value) => value).mockReturnValue({
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
    ebookRepository = module.get(getRepositoryToken(Ebook));
    wishRepository = module.get(getRepositoryToken(Wish));
    ebooksReaderRepository = module.get(getRepositoryToken(EbooksReader));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an ebook given valid data', async () => {
    ebookRepository.create = jest.fn().mockReturnValue((data) => { return { ...data, id: "10f68e83-ee89-4739-9682-c2c803748f36" } });

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

  it('should not create an ebook given non uuid-like author id', async () => {
    try {
      await service.create({
        title: "123",
        publisher: "a",
        author: "1-ee89-4739-9682-c2c803748f36",
        overview: "a",
        price: 1,
        stock: 2,
        fileData: ""
      });

      fail("No error thrown");

    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('should find an existing ebook', async () => {
    ebookRepository.findOne = jest.fn().mockReturnValue(createdEbook);

    const found = await service.findById("10f68e83-ee89-4739-9682-c2c803748f36");
    expect(found).toBeDefined();
  });

  it('should not find a non existing ebook', async () => {
    try {
      ebookRepository.findOne = jest.fn().mockReturnValue(null);
      const found = await service.findById("10f68e83-ee89-4739-9682-c2c803748f36");

      fail("No exception thrown")
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('should find all ebooks if existing', async () => {
    ebookRepository.findOne = jest.fn().mockReturnValue(createdEbooks);
    expect(ebookRepository).toBeDefined();
  });

  it('should return empty if there are no ebooks', async () => {
    ebookRepository.find = jest.fn().mockReturnValue([]);
    expect(ebookRepository).toBeDefined();
  });

  it('should update succesfully the fields of an ebook', async () => {
    ebookRepository.findOne = jest.fn().mockReturnValue(createdEbook);
    const updated = await service.update("10f68e83-ee89-4739-9682-c2c803748f36", { publisher: "newPublisher" })

    expect(updated).toBeDefined();
    expect(updated.publisher).toBe("newPublisher");
    expect(updated.title).toBe("123");

  });

  it('should affect 1 row if an ebook is deleted by id', async () => {
    ebookRepository.delete = jest.fn().mockReturnValue({ affected: 1 });
    try {
      await service.remove("10f68e83-ee89-4739-9682-c2c803748f36");

      fail("No exception thrown, no existing item to delete")
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('should add an existing book to an existing-user\'s wishlist', async () => {
    ebookRepository.delete = jest.fn().mockReturnValue({ affected: 1 });
    try {
      await service.remove("10f68e83-ee89-4739-9682-c2c803748f36");

      fail("No exception thrown, no existing item to delete")
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

const createdEbook = {
  id: "10f68e83-ee89-4739-9682-c2c803748f36",
  title: "123",
  publisher: "a",
  author: "90f68e83-ee89-4739-9682-c2c803748f36",
  overview: "a",
  price: 1,
  stock: 2,
  fileData: ""
}

const createdEbooks = [
  {
    "id": "f1d5f8e0-4d3b-4b5c-a54c-c8b7d24e45a6",
    "title": "El Enigma del Tiempo",
    "publisher": "Editorial Horizonte",
    "author": "3d3d1e6e-9fd4-42c3-9d8e-0d1b6a3a1282",
    "overview": "Una aventura en el espacio-tiempo que desafía las leyes de la física.",
    "price": 9.99,
    "stock": 25,
    "fileData": ""
  },
  {
    "id": "5eab3b82-b2b7-4f16-978d-7143e2f1fbd2",
    "title": "Los Secretos de la Sabiduría",
    "publisher": "Editorial Luz",
    "author": "c5df6a92-5643-470d-baff-858c5bb6ef56",
    "overview": "Un compendio de conocimiento antiguo y sabiduría práctica para la vida moderna.",
    "price": 7.49,
    "stock": 40,
    "fileData": ""
  },
  {
    "id": "7f8a61cd-9c3d-4a5f-8702-d4b07eae3d92",
    "title": "La Montaña del Alma",
    "publisher": "Editorial Raíces",
    "author": "d3f8f02e-50a6-4f8a-8c41-b0c7a8f45ea6",
    "overview": "Un viaje espiritual por paisajes montañosos y la búsqueda de la paz interior.",
    "price": 6.99,
    "stock": 32,
    "fileData": ""
  },
  {
    "id": "98c9d86f-4f53-4c1e-8739-92eaf84b4c1c",
    "title": "Los Viajes de Aurora",
    "publisher": "Editorial Viento Sur",
    "author": "f5d8b57d-9c5a-47a3-94c1-61f5f9f8c6f1",
    "overview": "Las aventuras de una joven exploradora en lugares exóticos alrededor del mundo.",
    "price": 8.99,
    "stock": 28,
    "fileData": ""
  },
  {
    "id": "3f5e8a9c-3c5d-451c-87a7-2b5d13b3e2e3",
    "title": "El Arte de la Caligrafía",
    "publisher": "Editorial Estilo",
    "author": "a7d6c8b2-46e9-4d2b-8475-9c56e9f7b34d",
    "overview": "Una guía completa sobre la práctica y técnicas de la caligrafía.",
    "price": 5.99,
    "stock": 15,
    "fileData": ""
  }
]
