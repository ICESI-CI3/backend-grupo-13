import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let mockOrderService: Partial<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
            generatePaymentLink: jest.fn().mockResolvedValue('https://payment-link.com'),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    mockOrderService = module.get<OrderService>(OrderService);
  });

  it('should return a payment link', async () => {
    const createOrderDto = { userId: 'uuid-user', ebookIds: ['uuid-book1', 'uuid-book2'] };
    const response = await controller.create(createOrderDto);
    expect(response).toEqual('https://payment-link.com');
  });
});
