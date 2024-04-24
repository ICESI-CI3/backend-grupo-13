import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Order } from '../order/entities/order.entity';
import { User } from '../auth/entities/user.entity';


describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: jest.Mocked<PaymentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [{
        provide: PaymentService,
        useValue: {
          getUserTransactionById: jest.fn(),
          getUserTransactions: jest.fn(),
          getAllTransactions: jest.fn(),
          getTransactionById: jest.fn(),
          createTransaction: jest.fn(),
          findOrderByReferenceCode: jest.fn(),
          processOrderBooks: jest.fn(),
          generatePaymentLink: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserTransactionById', () => {
    it('should return a transaction', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed412';
      const transactionId = 'b5ab68f0-6d20-48db-9bac-e069e45ed413';
      const mockTransaction : Transaction = new Transaction();
      mockTransaction.id = transactionId;
      (paymentService.getUserTransactionById as jest.Mock).mockResolvedValue(mockTransaction);
      
      const result = await controller.getUserTransactionById({ user: { userId } } as any, transactionId);
      
      expect(result).toEqual(mockTransaction);
      expect(paymentService.getUserTransactionById).toHaveBeenCalledWith(userId, transactionId);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed413';
      const transactionId = 'nonExistentTransactionId';
      const mockTransaction : Transaction = new Transaction();
      mockTransaction.id = transactionId;
      (paymentService.getUserTransactionById as jest.Mock).mockRejectedValue(new NotFoundException());    
      await expect(controller.getUserTransactionById({ user: { userId } } as any, transactionId)).rejects.toThrow(NotFoundException);
      expect(paymentService.getUserTransactionById).toHaveBeenCalledWith(userId, transactionId);
    });
  });
  describe('getUserTransactions', () => {
    it('should return user transactions', async () => {

      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed413';
      const tem1 : Transaction = new Transaction();
      const tem2 : Transaction = new Transaction();
      const mockTransactions: Transaction[] = [tem1,tem2  ];
      (paymentService.getUserTransactions as jest.Mock).mockResolvedValue(mockTransactions);
      
      const result = await controller.getUserTransactions({ user: { userId } } as any);
      
      expect(result).toEqual(mockTransactions);
      expect(paymentService.getUserTransactions).toHaveBeenCalledWith(userId);
    });
  });
  describe('handleResponse', () => {
    describe('handleResponse', () => {
      it('should process approved transaction', async () => {
        const mockTransactionData: CreateTransactionDto = new CreateTransactionDto();
        mockTransactionData.referenceCode = 'b5ab68f0-6d20-48db-9bac-e069e45ed412';
        mockTransactionData.message = 'APPROVED';  // Ensure this is exactly as expected in the condition
    
        const user1: Partial<User> = {
            id: 'b5ab68f0-6d20-48db-9bac-e069e45ed413',
        };
        mockTransactionData.user = user1 as User;
    
        const mockOrder: Order = new Order();
        mockOrder.user = user1 as User;
    
        const mockTransaction: Transaction = new Transaction();
        mockTransaction.referenceCode = 'b5ab68f0-6d20-48db-9bac-e069e45ed413';
        mockTransaction.message = 'APPROVED';
    
        paymentService.findOrderByReferenceCode.mockResolvedValue(mockOrder);
        paymentService.createTransaction.mockResolvedValue(mockTransaction);
    
        const mockJson = jest.fn();
        const res = { json: mockJson } as unknown as Response;
    
        await (controller.handleResponse as jest.Mock)(mockTransactionData, res);
    
        expect(paymentService.findOrderByReferenceCode).toHaveBeenCalledWith(mockTransactionData.referenceCode);
        expect(paymentService.createTransaction).toHaveBeenCalledWith(mockTransactionData);
        expect(paymentService.processOrderBooks).toHaveBeenCalledWith(mockOrder);
        expect(mockJson).toHaveBeenCalledWith(mockTransaction);
    });
    
    });
    
    describe('handleConfirmation', () => {
      describe('handleConfirmation', () => {
        it('should process approved transaction', async () => {
          const mockTransactionData: CreateTransactionDto = new CreateTransactionDto();
          mockTransactionData.referenceCode = 'b5ab68f0-6d20-48db-9bac-e069e45ed412';
          mockTransactionData.message = 'APPROVED';  
      
          const user1: Partial<User> = {
              id: 'b5ab68f0-6d20-48db-9bac-e069e45ed413',
          };
          mockTransactionData.user = user1 as User;
      
          const mockOrder: Order = new Order();
          mockOrder.user = user1 as User;
      
          const mockTransaction: Transaction = new Transaction();
          mockTransaction.referenceCode = 'b5ab68f0-6d20-48db-9bac-e069e45ed413';
          mockTransaction.message = 'APPROVED';
      
          paymentService.findOrderByReferenceCode.mockResolvedValue(mockOrder);
          paymentService.createTransaction.mockResolvedValue(mockTransaction);
      
          const mockJson = jest.fn();
          const res = { json: mockJson } as unknown as Response;
      
          await (controller.handleConfirmation as jest.Mock)(mockTransactionData, res);
      
          expect(paymentService.findOrderByReferenceCode).toHaveBeenCalledWith(mockTransactionData.referenceCode);
          expect(paymentService.createTransaction).toHaveBeenCalledWith(mockTransactionData);
          expect(paymentService.processOrderBooks).toHaveBeenCalledWith(mockOrder);
          expect(mockJson).toHaveBeenCalledWith(mockTransaction);
      });
      
      });
      describe('getAllTransactions', () => {
        it('should retrieve all transactions', async () => {
          const mockTransactions: Transaction[] = [
            new Transaction(), 
            new Transaction(),
          ];
    
          paymentService.getAllTransactions.mockResolvedValue(mockTransactions);
    
          const result = await controller.getAllTransactions();
    
          expect(result).toEqual(mockTransactions);
          expect(paymentService.getAllTransactions).toHaveBeenCalled();
        });
    
        it('should handle exceptions', async () => {
          const error = new HttpException('Failed to retrieve transactions', HttpStatus.INTERNAL_SERVER_ERROR);
          paymentService.getAllTransactions.mockRejectedValue(error);
    
          await expect(controller.getAllTransactions()).rejects.toThrow(HttpException);
        });
      });

      describe('getTransactionById', () => {
        it('should retrieve a specific transaction by ID', async () => {
          const mockId = 'some-transaction-id';
          const expectedTransaction = new Transaction();
          paymentService.getTransactionById.mockResolvedValue(expectedTransaction);
    
          const result = await controller.getTransactionById(mockId);
    
          expect(result).toEqual(expectedTransaction);
          expect(paymentService.getTransactionById).toHaveBeenCalledWith(mockId);
        });
    
        it('should throw NotFoundException when transaction is not found', async () => {
          const mockId = 'non-existent-transaction-id';
          paymentService.getTransactionById.mockRejectedValue(new NotFoundException());
    
          await expect(controller.getTransactionById(mockId)).rejects.toThrow(NotFoundException);
          expect(paymentService.getTransactionById).toHaveBeenCalledWith(mockId);
        });
      });

  });
});})
