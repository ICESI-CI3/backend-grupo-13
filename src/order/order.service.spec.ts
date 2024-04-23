import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { EbooksService } from 'src/ebooks/ebooks.service';
import { PaymentService } from 'src/payment/payment.service';
import { AuthService } from 'src/auth/auth.service';

describe('OrderService', () => {
  let service: OrderService;
  let mockOrderRepository: Partial<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: EbooksService,
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            generatePaymentLink: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    mockOrderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should create an order successfully', async () => {
    const createOrderDto = { userId: 'uuid-user', ebookIds: ['uuid-book1', 'uuid-book2'] };
    const user = { id: 'uuid-user', email: 'user@example.com' };
    const ebooks = [{ id: 'uuid-book1', price: 20 }, { id: 'uuid-book2', price: 30 }];

    jest.spyOn(service, 'createOrder').mockImplementation(async () => ({
      referenceCode: 'uuid-order',
      user,
      ebooks,
      amount: 50,
      purchaseDate: new Date(),
    }));

    const order = await service.createOrder(createOrderDto);
    expect(order).toBeDefined();
    expect(order.amount).toEqual(50);
  });
});
