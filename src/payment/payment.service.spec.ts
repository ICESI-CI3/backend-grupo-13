import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OrderService } from '../order/order.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Order } from '../order/entities/order.entity';
import { HttpException, NotFoundException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  let transactionRepository: Repository<Transaction>;
  let configService: ConfigService;
  let orderService: OrderService;

  beforeEach(async () => {
    const configValues = {
      'PAYU_API_KEY': 'api_key',
      'PAYU_MERCHANT_ID': 'merchant_id',
      'PAYU_URL': 'https://example.com/pay',
      'PAYU_ACCOUNT_ID': 'account_id',
      'PAYU_RESPONSE_URL': 'https://example.com/response',
      'PAYU_CONFIRMATION_URL': 'https://example.com/confirmation',
      'TEST_FLAG': '1',
      'CURRENCY': 'USD',
      'DESCRIPTION': 'Test payment'
    };
    

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => configValues[key]),
          },
        },
        {
          provide: OrderService,
          useValue: {
            findOrderByReferenceCode: jest.fn(),
            processOrderBooks: jest.fn(),
          },
        },
      ],
      
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    configService = module.get(ConfigService);
    orderService = module.get(OrderService);
    
    (service as any).payuUrl = "https://example.com/pay";
    service['merchantId'] = "123456";
    service['accountId'] = "654321";
    service['description'] = "Test Payment";
    service['referenceCode'] = "REF123";
    service['amount'] = 100;
    service['tax'] = 19;
    service['taxReturnBase'] = 81;
    service['currency'] = "USD";
    service['signature'] = "generated_signature";
    service['test'] = 1;
    service['responseUrl'] = "https://example.com/response";
    service['confirmationUrl'] = "https://example.com/confirmation";
    service['buyerEmail'] = "test@example.com";
  });

  describe('generateFormSignature', () => {
    it('should generate a correct MD5 hash for the given parameters', () => {
      const apiKey = 'testApiKey';
      const merchantId = 'testMerchantId';
      const referenceCode = 'testReferenceCode';
      const amount = '100.00';
      const currency = 'USD';
      const expectedSignature = 'c2acddc4715335c79e4c6943bd14446b';

      const result = service.generateFormSignature(apiKey, merchantId, referenceCode, amount, currency);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedSignature);
    });

    it('should handle edge cases like empty strings', () => {
      const result = service.generateFormSignature('', '', '', '', '');
      expect(result).toBeDefined();
      expect(result).toEqual('ed790e134796eb704dd092dde146a792'); // MD5 for an empty string
    });
  });

  describe('generatePaymentHtml', () => {
    it('should generate correct HTML for payment redirection', () => {
      const html = service.generatePaymentHtml();
      expect(html).toContain('<form id="payuForm" action="https://example.com/pay" method="post">');
      expect(html).toContain('name="merchantId" value="123456"');
      expect(html).toContain('name="accountId" value="654321"');
      expect(html).toContain('name="description" value="Test Payment"');
      expect(html).toContain('name="referenceCode" value="REF123"');
      expect(html).toContain('name="amount" value="100"');
      expect(html).toContain('name="tax" value="19"');
      expect(html).toContain('name="taxReturnBase" value="81"');
      expect(html).toContain('name="currency" value="USD"');
      expect(html).toContain('name="signature" value="generated_signature"');
      expect(html).toContain('name="responseUrl" value="https://example.com/response"');
      expect(html).toContain('name="confirmationUrl" value="https://example.com/confirmation"');
      expect(html).toContain('name="buyerEmail" value="test@example.com"');
    });
  });

  describe('createTransaction', () => {
    it('should successfully create a transaction', async () => {
      const transactionData: CreateTransactionDto = new CreateTransactionDto();
      
      (transactionRepository.create as jest.Mock).mockReturnValue(transactionData);

      (transactionRepository.save as jest.Mock).mockResolvedValue(transactionData);

      const result = await service.createTransaction(transactionData);

      expect(transactionRepository.create).toHaveBeenCalledWith(transactionData);

      expect(transactionRepository.save).toHaveBeenCalledWith(transactionData);

      expect(result).toEqual(transactionData);

    });

    it('should handle errors when creating a transaction', async () => {
      const transactionData: CreateTransactionDto = new CreateTransactionDto();

      (transactionRepository.create as jest.Mock).mockReturnValue(transactionData);

      const saveError = new Error('Error saving transaction');
      (transactionRepository.save as jest.Mock).mockRejectedValue(saveError);

      await expect(service.createTransaction(transactionData)).rejects.toThrow(saveError);
    });

  });

  describe('findOrderByReferenceCode', () => {
    it('should find and return an order by reference code', async () => {
      const referenceCode = 'valid_reference_code';
      const expectedOrder = new Order();
      (orderService.findOrderByReferenceCode as jest.Mock).mockResolvedValue(expectedOrder);
      const result = await service.findOrderByReferenceCode(referenceCode);
      expect(orderService.findOrderByReferenceCode).toHaveBeenCalledWith(referenceCode);
      expect(result).toEqual(expectedOrder);
    });

    it('should throw a NotFoundException when an order with the given reference code is not found', async () => {
      const referenceCode = 'invalid_reference_code';
      (orderService.findOrderByReferenceCode as jest.Mock).mockResolvedValue(null);
      await expect(service.findOrderByReferenceCode(referenceCode)).rejects.toThrow(NotFoundException);
      expect(orderService.findOrderByReferenceCode).toHaveBeenCalledWith(referenceCode);
    });
  });
  describe('processOrderBooks', () => {
    it('should call processOrderBooks on orderService with the provided order', async () => {
      const order = new Order(); 
      (orderService.processOrderBooks as jest.Mock).mockResolvedValue(undefined);
      await service.processOrderBooks(order);
      expect(orderService.processOrderBooks).toHaveBeenCalledWith(order);
    });
  });
  describe('getAllTransactions', () => {
    it('should retrieve all transactions', async () => {
    const tem1 : Transaction = new Transaction();
    const tem2 : Transaction = new Transaction();
    const mockTransactions: Transaction[] = [tem1,tem2  ];

    (transactionRepository.find as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await service.getAllTransactions();

    expect(transactionRepository.find).toHaveBeenCalled();

    expect(result).toEqual(mockTransactions);
  });

  });

  describe('getTransactionById', () => {
    it('should retrieve the transaction if it exists', async () => {
      const mockId = 'b5ab68f0-6d20-48db-9bac-e069e45ed412';
      const expectedTransaction : Transaction = new Transaction();
      
  
      (transactionRepository.findOne as jest.Mock).mockResolvedValue(expectedTransaction);
  
      const result = await service.getTransactionById(mockId);
  
      expect(transactionRepository.findOne).toHaveBeenCalledWith({ where: { id: mockId } });
      expect(result).toEqual(expectedTransaction);
    });
    it('should throw a HttpException for any other errors', async () => {
      const mockId = 'invalid-id';
      (transactionRepository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });
  
      await expect(service.getTransactionById(mockId)).rejects.toThrow(HttpException);

    });
  });


  describe('getUserTransactions', () => {
    it('should retrieve all transactions for a given user', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed412';
      const tem1 : Transaction = new Transaction();
      const tem2 : Transaction = new Transaction();
      const mockTransactions: Transaction[] = [tem1,tem2  ];
  
      (transactionRepository.find as jest.Mock).mockResolvedValue(mockTransactions);
  
      const result = await service.getUserTransactions(userId);
  
      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } }
      });
      expect(result).toEqual(mockTransactions);
    });
    it('should throw NotFoundException if no transactions are found for the user', async () => {
      const userId = 'user-with-no-transactions';
      (transactionRepository.find as jest.Mock).mockResolvedValue([]);
  
      await expect(service.getUserTransactions(userId)).rejects.toThrow(HttpException);
  
    });
  }); 
  
  describe('getUserTransactions', () => {
    it('should retrieve a specific transaction by ID for a given user', async () => {
      const userId = 'b5ab68f0-6d20-48db-9bac-e069e45ed412';
      const transactionId = 'b5ab68f0-6d20-48db-9bac-e069e45ed412';
      const mockTransaction : Transaction = new Transaction();
      mockTransaction.id = transactionId;

      (transactionRepository.findOne as jest.Mock).mockResolvedValue(mockTransaction);
  
      const result = await service.getUserTransactionById(userId, transactionId);
  
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, user: { id: userId } }
      });
      expect(result).toEqual(mockTransaction);
    });
    it('should handle other errors with HttpException', async () => {
      const userId = 'valid-user-id';
      const transactionId = 'valid-transaction-id';
      const error = new Error('Unexpected error');
      (transactionRepository.findOne as jest.Mock).mockImplementation(() => {
        throw error;
      });
  
      await expect(service.getUserTransactionById(userId, transactionId))
        .rejects.toThrow(HttpException);
  

  });

  });
});
