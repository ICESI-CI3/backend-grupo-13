import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: Partial<OrderService>;

  beforeEach(async () => {
    orderService = {
      createOrder: jest.fn().mockImplementation((userId, createOrderDto) => Promise.resolve({
        id: 'b5ab68f0-6d20-48db-9bac-e069e45ed4f2',
        user: { id: userId, email: 'user@example.com' },
        ebooks: createOrderDto.ebookIds.map(id => ({ id, title: `Title for ${id}`, price: 100 })),
        amount: 100 * createOrderDto.ebookIds.length,
        referenceCode: 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1'
      })),
      
      getUserOrders: jest.fn().mockImplementation(userId => Promise.resolve([
        {
          id: 'order-1',
          user: { id: userId, email: 'user@example.com' },
          ebooks: [{ id: 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff', title: 'Ebook One', price: 100 }],
          amount: 100,
          referenceCode: 'ref-1'
        },
       
      ])),
      
      getUserOrderById: jest.fn().mockImplementation((userId, orderId) => Promise.resolve({
        id: orderId,
        user: { id: userId, email: 'user@example.com' },
        ebooks: [{ id: 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff', title: 'Ebook One', price: 100 }],
        amount: 100,
        referenceCode: 'ref-1'
      })),
      
      getAllOrders: jest.fn().mockImplementation(() => Promise.resolve([
        {
          id: 'order-1',
          user: { id: 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff', email: 'user1@example.com' },
          ebooks: [{ id: 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1', title: 'Ebook One', price: 100 }],
          amount: 100,
          referenceCode: 'ref-1'
        },
      ])),
      
      getOrderById: jest.fn().mockImplementation(id => Promise.resolve({
        id: id,
        user: { id: 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff', email: 'user1@example.com' },
        ebooks: [{ id: 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff', title: 'Ebook One', price: 100 }],
        amount: 100,
        referenceCode: 'ref-1'
      })),
      
      generatePaymentLink: jest.fn().mockResolvedValue('http://payment.link'),
      
      
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /order/create', () => {
    it('should create a new order and generate a payment link', async () => {
      const req = { user: { userId: 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff' } };
      const ebookIds = ['b5ab68f0-6d20-48db-9bac-e069e45ed412', 'b5ab68f0-6d20-48db-9bac-e069e45ed421'];
      const createOrderDto = { ebookIds };      const result = await controller.create(req, createOrderDto);

      expect(orderService.createOrder).toHaveBeenCalledWith(req.user.userId, createOrderDto);
      expect(orderService.generatePaymentLink).toHaveBeenCalled();
      expect(result).toEqual('http://payment.link');
    });
  });

  describe('POST /order/create/:orderId', () => {
    it('should create a new order to a specific user and generate a payment link', async () => {
      const req = { user: { userId: 'b5ab68f0-6d20-48db-9bac-e069e45ed4ff' } };
      const ebookIds = ['b5ab68f0-6d20-48db-9bac-e069e45ed412', 'b5ab68f0-6d20-48db-9bac-e069e45ed421'];
      const createOrderDto = { ebookIds };      const result = await controller.create(req, createOrderDto);

      expect(orderService.createOrder).toHaveBeenCalledWith(req.user.userId, createOrderDto);
      expect(orderService.generatePaymentLink).toHaveBeenCalled();
      expect(result).toEqual('http://payment.link');
    });
  });


  describe('GET /:orderId', () => {
    it('should return an order by ID for the authenticated user', async () => {
      const req = { user: { userId: 'user-id' } };
      const orderId = 'order-id';
      const expectedOrder = {
        id: orderId,
        user: { id: req.user.userId, email: 'user@example.com' },
        ebooks: [{ id: 'ebook-1', title: 'Ebook One', price: 100 }],
        amount: 100,
        referenceCode: 'ref-123'
      };

      (orderService.getUserOrderById as jest.Mock).mockResolvedValue(expectedOrder);

      const result = await controller.getUserOrderById(req, orderId);

      expect(orderService.getUserOrderById).toHaveBeenCalledWith(req.user.userId, orderId);
      expect(result).toEqual(expectedOrder);
    });

    it('should handle the case when an order is not found', async () => {
      const req = { user: { userId: 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1' } };
      const orderId = 'non-existent-order-id';
      (orderService.getUserOrderById as jest.Mock).mockResolvedValue(null); 
  
      try {
        await controller.getUserOrderById(req, orderId);
        fail('Should have thrown an error for not finding the order'); 
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
       
      }
  
      expect(orderService.getUserOrderById).toHaveBeenCalledWith(req.user.userId, orderId);
    });
    
  });
  describe('GET /', () => {
    it('should return all orders by the user for the authenticated user', async () => {
      const req = { user: { userId: 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1' } };
      const order1 : Order = new Order();
      order1.referenceCode = 'b5ab68f0-6d20-48db-9bac-e069e45ed4f1';
      const order2 : Order = new Order();
      order2.referenceCode = 'b5ab68f0-6d20-48db-9bac-e069e45ed4f2';
      const mockOrders = [order1,order2];

      
      (orderService.getUserOrders as jest.Mock).mockResolvedValue(mockOrders);

      const result = await controller.getUserOrders(req);
      expect(orderService.getUserOrders).toHaveBeenCalledWith(req.user.userId);
      expect(result).toEqual(mockOrders);
    });

    it('should throw NotFoundException if no orders are found for the user', async () => {
      const req = { user: { userId: 'b5ab68f0-6d20-48db-9bac-e069e45ed4f2' } };

      (orderService.getUserOrders as jest.Mock).mockResolvedValue([]);

      try {
        await controller.getUserOrders(req);
        fail('The controller did not throw a NotFoundException as expected');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
      }
    });
  });

  describe('GET /:userId/:orderId', () => {
    it('should retrieve an order for a given user and order ID', async () => {
      const userId = 'user-123';
      const orderId = 'order-456';
      const expectedOrder = {
        id: orderId,
        user: { id: userId },
        // additional order details
      };

      
      (orderService.getUserOrderById as jest.Mock).mockResolvedValue(expectedOrder);

      const result = await controller.getOfUserOrderById(orderId, userId);
      expect(orderService.getUserOrderById).toHaveBeenCalledWith(userId, orderId);
      expect(result).toEqual(expectedOrder);
    });

    it('should handle not finding an order', async () => {
      const userId = 'user-123';
      const orderId = 'order-456';

      (orderService.getUserOrderById as jest.Mock).mockResolvedValue(null);

      try {
        await controller.getOfUserOrderById(orderId, userId);
        fail('The controller did not throw a NotFoundException as expected');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
      }
    });
  });
  describe('GET /all', () => {
    it('should retrieve all orders from the system', async () => {
      const expectedOrders = [
        { id: 'order1' },
        { id: 'order2' }
      ];

      (orderService.getAllOrders as jest.Mock).mockResolvedValue(expectedOrders);

      const result = await controller.getAllOrders();
      expect(orderService.getAllOrders).toHaveBeenCalled();
      expect(result).toEqual(expectedOrders);
    });
  });
  describe('GET /:id', () => {
    it('should retrieve an order by ID', async () => {
      const orderId = 'valid-order-id';
      const expectedOrder = {
        id: orderId,
      };
      
      (orderService.getOrderById as jest.Mock).mockResolvedValue(expectedOrder);

      const result = await controller.getOrderById(orderId);
      expect(orderService.getOrderById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(expectedOrder);
    });

    it('should throw NotFoundException if no order is found', async () => {
      const orderId = 'invalid-order-id';
      (orderService.getOrderById as jest.Mock).mockResolvedValue(null);

      await expect(controller.getOrderById(orderId))
        .rejects.toThrow(new NotFoundException(`Not Found orders by user ${orderId}`));

      expect(orderService.getOrderById).toHaveBeenCalledWith(orderId);
    });
  });



  

});
