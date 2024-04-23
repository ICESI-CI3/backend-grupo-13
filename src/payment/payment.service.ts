import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionFormDto } from './dto/create-transaction-form.dto';
<<<<<<< HEAD
import { OrderService } from '../order/order.service';
import { Order } from '../order/entities/order.entity';
=======
import { OrderService } from 'src/order/order.service';
import { Order } from 'src/order/entities/order.entity';
import { validateUuid } from 'src/utils/validateUuid';
>>>>>>> 178d59492a7f614aeadfdd6722481a3417201507

@Injectable()
export class PaymentService {
  private apiKey: string;
  private merchantId: string;
  private payuUrl: string;
  private accountId: string;
  private description: string;
  private referenceCode: string;
  private amount: number;
  private tax: number;
  private taxReturnBase: number;
  private currency: string;
  private signature: string;
  private test: number;
  private responseUrl: string;
  private confirmationUrl: string;
  private buyerEmail: string;
  httpService: any;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private configService: ConfigService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {
    this.apiKey = this.configService.get<string>('PAYU_API_KEY');
    this.merchantId = this.configService.get<string>('PAYU_MERCHANT_ID');
    this.payuUrl = this.configService.get<string>('PAYU_URL');
    this.accountId = this.configService.get<string>('PAYU_ACCOUNT_ID');
    this.responseUrl = this.configService.get<string>('PAYU_RESPONSE_URL');
    this.confirmationUrl = this.configService.get<string>('PAYU_CONFIRMATION_URL');
    this.test = +this.configService.get<string>('TEST_FLAG');
    this.currency = this.configService.get<string>('CURRENCY');
    this.description = this.configService.get<string>('DESCRIPTION');

  }
  generateFormSignature(apiKey:string,merchantId:string, referenceCode:string, amount:string,currency:string): string {
    const hashString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`;
    return crypto.createHash('md5').update(hashString).digest('hex');
  }

  generatePaymentHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Redirecting to Payment...</title>
      </head>
      <body onload="document.getElementById('payuForm').submit();">
          <form id="payuForm" action="${this.payuUrl}" method="post">
              <input type="hidden" name="merchantId" value="${this.merchantId}" />
              <input type="hidden" name="accountId" value="${this.accountId}" />
              <input type="hidden" name="description" value="${this.description}" />
              <input type="hidden" name="referenceCode" value="${this.referenceCode}" />
              <input type="hidden" name="amount" value="${this.amount}" />
              <input type="hidden" name="tax" value="${this.tax}" />
              <input type="hidden" name="taxReturnBase" value="${this.taxReturnBase}" />
              <input type="hidden" name="currency" value="${this.currency}" />
              <input type="hidden" name="signature" value="${this.signature}" />
              <input name="test" type="hidden" value="${this.test}">
              <input type="hidden" name="responseUrl" value="${this.responseUrl}" />
              <input type="hidden" name="confirmationUrl" value="${this.confirmationUrl}" />
              <input type="hidden" name="buyerEmail" value="${this.buyerEmail}" />
          </form>
      </body>
      </html>
    `;
  }
  
  generatePaymentLink(createTransactionFormDto : CreateTransactionFormDto): string {
    this.amount=createTransactionFormDto.amount;
    this.referenceCode=createTransactionFormDto.referenceCode;
    this.buyerEmail=createTransactionFormDto.buyerEmail;
    this.currency=this.currency;
    this.amount=createTransactionFormDto.amount;
    this.signature = this.generateFormSignature(this.apiKey,this.merchantId, this.referenceCode, this.amount.toString(),this.currency);
    this.tax = this.amount * 0.19;
    this.taxReturnBase = this.amount - this.tax;

    return this.generatePaymentHtml();
  }
  async createTransaction(transactionData: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }
  
  async findOrderByReferenceCode(referenceCode:string): Promise<Order> {
    return await this.orderService.findOrderByReferenceCode(referenceCode);
  }
  async processOrderBooks(order:Order): Promise<void> {
    return await this.orderService.processOrderBooks(order);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransactionById(id: string): Promise<Transaction> {
    try {
        validateUuid(id);

        const transaction = await this.transactionRepository.findOne({ where: { id } });
        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found.`);
        }
        return transaction;
    } catch (error) {
        console.error(`Error finding transaction by ID: ${error.message}`);
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: `Error finding transaction: ${error.message}`,
        }, HttpStatus.BAD_REQUEST);
    }
    
}
async getUserTransactions(userId: string): Promise<Transaction[]> {
  try {
    validateUuid(userId);
  const transactions = await this.transactionRepository.find({where: {user: { id: userId }}
  });
  if (!transactions) {
      throw new NotFoundException(`Transactions for user ID ${userId} not found.`);
  }
  return transactions;
} catch (error) {
  console.error(`Error finding transaction by ID: ${error.message}`);
  throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: `Error finding transaction: ${error.message}`,
  }, HttpStatus.BAD_REQUEST);
}
}


async getUserTransactionById(userId: string, transactionId: string): Promise<Transaction> {
  try {
    validateUuid(userId);
    validateUuid(transactionId);
  const transaction = await this.transactionRepository.findOne({where: { id: transactionId, user: { id: userId } },});
  if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transactionId} for user ID ${userId} not found.`);
  }
  return transaction;
} catch (error) {
  console.error(`Error finding transaction by ID: ${error.message}`);
  throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: `Error finding transaction: ${error.message}`,
  }, HttpStatus.BAD_REQUEST);
}
}
  
  
}
