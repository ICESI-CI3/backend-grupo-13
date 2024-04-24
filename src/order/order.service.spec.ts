import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { EbooksService } from '../ebooks/ebooks.service';
import { PaymentService } from '../payment/payment.service';
import { AuthService } from '../auth/auth.service';
import { Author } from '../auth/entities/user.entity';
import { Ebook } from '../ebooks/entities/ebook.entity';
import { HttpException, NotFoundException } from '@nestjs/common';


describe('OrderService', () => {
  type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let ebooksService: Partial<EbooksService>;
  let paymentService: Partial<PaymentService>;
  let authService: Partial<AuthService>;
  let orderRepositoryMock: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    orderRepositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),

    } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepositoryMock,
        },
        {
          provide: EbooksService,
          useValue: mockEbooksService(),
        },
        {
          provide: PaymentService,
          useValue: mockPaymentService(),
        },
        {
          provide: AuthService,
          useValue: mockAuthService(),
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    ebooksService = module.get(EbooksService);
    paymentService = module.get(PaymentService);
    authService = module.get(AuthService);
  });

  function mockRepository() {
    return {
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(order => Promise.resolve({ ...order, referenceCode: 'new-order-ref-code' })),
      findOne: jest.fn(),
    };
  }

  function mockEbooksService() {
    return {
      addEbooksToReader: jest.fn().mockResolvedValue(undefined),
      findAllEbooksByReader: jest.fn().mockResolvedValue([]),
      findBy: jest.fn().mockResolvedValue([]),
    };
  }

  function mockPaymentService() {
    return {
      generatePaymentLink: jest.fn().mockResolvedValue('http://payment.link'),
    };
  }

  function mockAuthService() {
    return {
      getUserById: jest.fn().mockResolvedValue({ id: 'user-id', email: 'user@example.com' }),
    };
  }

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(orderRepository).toBeDefined();
      expect(ebooksService).toBeDefined();
      expect(paymentService).toBeDefined();
      expect(authService).toBeDefined();
    });
  });

  describe('Creating a new order', () => {
    it('should create a new order successfully', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff';
      const ebookIds = ['b5ab68f0-6d20-48db-9bac-e069e45ed412', 'b5ab68f0-6d20-48db-9bac-e069e45ed421'];
      const createOrderDto = { ebookIds };

      authService.getUserById = jest.fn().mockResolvedValue({ id: userId, email: 'user@example.com' }) as any;
      ebooksService.findAllEbooksByReader = jest.fn().mockResolvedValue([]) as any;
      ebooksService.findBy = jest.fn().mockResolvedValue([{ id: 'ebook-id-1', price: 10 }, { id: 'ebook-id-2', price: 15 }]) as any;
      orderRepository.create = jest.fn().mockImplementation(order => order) as any;
      orderRepository.save = jest.fn().mockImplementation(order => Promise.resolve(order)) as any;

      const order = await service.createOrder(userId, createOrderDto);

      expect(authService.getUserById).toHaveBeenCalledWith(userId);
      expect(ebooksService.findAllEbooksByReader).toHaveBeenCalledWith(userId);
      expect(ebooksService.findBy).toHaveBeenCalledWith(ebookIds);
      expect(orderRepository.create).toHaveBeenCalled();
      expect(orderRepository.save).toHaveBeenCalled();
      expect(order.ebooks.length).toBe(2);
      expect(order.amount).toBe(25);
    });
    it('should throw an error if getUserById returns null', async () => {
      const userId = 'non-existing-user-id';
      
      (authService.getUserById as jest.Mock).mockResolvedValue(null);
      
      await expect(service.createOrder(userId, { ebookIds: [] })).rejects.toThrow();
    });
  
    it('should throw an error if findAllEbooksByReader returns non-matching IDs', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff';
      (authService.getUserById as jest.Mock).mockResolvedValue({ id: userId, email: 'user@example.com' });
      (ebooksService.findAllEbooksByReader as jest.Mock).mockResolvedValue(['ebook-id-not-in-order']);
  
      await expect(service.createOrder(userId, { ebookIds: ['ebook-id-in-order'] }))
        .rejects.toThrow(HttpException);
    });
  });
  describe('calculateTotalAmount', () => {
    it('should return the total amount of all ebooks', () => {
      const orderRepositoryMock = mockRepository();
      const ebooksServiceMock = mockEbooksService();
      const paymentServiceMock = mockPaymentService();
      const authServiceMock = mockAuthService();
  
      const service = new OrderService(
        orderRepositoryMock as any,
        ebooksServiceMock as any,
        paymentServiceMock as any,
        authServiceMock  as any
      );


      const ebook1 = new Ebook();
      ebook1.title = "Title of Ebook 1";
      ebook1.price = 10000;

      const ebook2 = new Ebook();
      ebook2.title = "Title of Ebook 2";
      ebook2.price = 20000;
      
      const ebooks : Ebook[] = [ebook1,ebook2];

      let sum = 0;

      for (let i = 0; i < ebooks.length; i++) {
        sum += service['calculateTotalAmount'](ebooks);
      }
      const totalAmount = service['calculateTotalAmount'](ebooks);
  
      expect(totalAmount).toBe(30000); 
    });
  });
  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      
      const mockOrders = [
        { id: 'order-1',},
        { id: 'order-2'},
      ];
  
      const orderRepositoryMock = {
        find: jest.fn().mockResolvedValue(mockOrders), 
      };
      const ebooksServiceMock = mockEbooksService();
      const paymentServiceMock = mockPaymentService();
      const authServiceMock = mockAuthService();
  
      const service = new OrderService(
        orderRepositoryMock as any,
        ebooksServiceMock as any,
        paymentServiceMock as any,
        authServiceMock as any
      );
  
      const orders = await service.getAllOrders();
  
      expect(orderRepositoryMock.find).toHaveBeenCalled();
      expect(orders).toEqual(mockOrders); 
    });
  });
  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const id = 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff';
      const orderRepositoryMock = {
        findOne: jest.fn().mockResolvedValue({ id }),
      };
      const ebooksServiceMock = mockEbooksService();
      const paymentServiceMock = mockPaymentService();
      const authServiceMock = mockAuthService();
  
      const service = new OrderService(
        orderRepositoryMock as any,
        ebooksServiceMock as any,
        paymentServiceMock as any,
        authServiceMock  as any
      );
  
      const order = await service.getOrderById(id);
  
      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { referenceCode: id },
        relations: ['user', 'ebooks'],
      });
      expect(order).toEqual({ id  }); 
    });
  
    it('should throw NotFoundException if order is not found', async () => {
      const id = 'invalid-order-id';
      const orderRepositoryMock = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      const ebooksServiceMock = mockEbooksService();
      const paymentServiceMock = mockPaymentService();
      const authServiceMock = mockAuthService();
  
      const service = new OrderService(
        orderRepositoryMock as any,
        ebooksServiceMock as any,
        paymentServiceMock as any,
        authServiceMock  as any
      ); 
  
      await expect(service.getOrderById(id)).rejects.toThrow(HttpException);
    });
  
  });
  describe('getUserOrders', () => {
    it('should return all orders for a given user ID', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1';
      const tem1 : Order = new Order();
      tem1.referenceCode='b5ab68f0-6d20-48db-9bac-e069e45ed4f2'
      tem1.amount=30000
      const tem2 : Order = new Order();
      tem2.referenceCode='b5ab68f0-6d20-48db-9bac-e069e45ed4f3'
      tem2.amount=10000
      const mockOrders : Order[] = [tem1,tem2];
      const orderRepositoryMock = {
        find: jest.fn().mockResolvedValue(mockOrders),
      };
  
      const ebooksServiceMock = mockEbooksService();
      const paymentServiceMock = mockPaymentService();
      const authServiceMock = mockAuthService();
  
      const service = new OrderService(
        orderRepositoryMock as any,
        ebooksServiceMock as any,
        paymentServiceMock as any,
        authServiceMock  as any
      );
  
      const orders = await service.getUserOrders(userId);
  
      expect(orderRepositoryMock.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user', 'ebooks'],
      });
      expect(orders).toEqual(mockOrders);
    });
  
    
    it('should return an empty array if no orders found for the user', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1';
      orderRepositoryMock.find.mockResolvedValue([]);
    
      const orders = await service.getUserOrders(userId);
    
      expect(orderRepositoryMock.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user', 'ebooks'],
      });
      expect(orders).toEqual([]); 
    });
  });
  
  describe('getUserOrderById', () => {
    it('should return a specific order for a user by order ID', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1';
      const orderId = 'b5ab68f0-6d20-48db-9bac-e069e45ed4f2';
      const tem1 : Order = new Order();
      tem1.referenceCode='b5ab68f0-6d20-48db-9bac-e069e45ed4f2'
      tem1.amount=30000
      const tem2 : Order = new Order();
      tem2.referenceCode='b5ab68f0-6d20-48db-9bac-e069e45ed4f3'
      const mockOrder:Order[] = [tem1,tem2]
      const orderRepositoryMock = {
        findOne: jest.fn().mockResolvedValue(mockOrder),
      };
      
      const ebooksServiceMock = mockEbooksService();
      const paymentServiceMock = mockPaymentService();
      const authServiceMock = mockAuthService();
  
      const service = new OrderService(
        orderRepositoryMock as any,
        ebooksServiceMock as any,
        paymentServiceMock as any,
        authServiceMock  as any
      );

      const order = await service.getUserOrderById(userId, orderId);
  
      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { referenceCode: orderId, user: { id: userId } },
        relations: ['user', 'ebooks'],
      });
      expect(order).toEqual(mockOrder);
    });
  
    it('should throw NotFoundException if the order is not found for the user', async () => {
      const userId = 'valid-user-id';
      const orderId = 'invalid-order-id';
      const orderRepositoryMock = {
        findOne: jest.fn().mockResolvedValue(null), 
      };
  

  
      await expect(service.getUserOrderById(userId, orderId)).rejects.toThrow(HttpException);
    });
  });
  
  
});

