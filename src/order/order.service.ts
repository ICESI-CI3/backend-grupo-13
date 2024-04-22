import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { EbooksService } from 'src/ebooks/ebooks.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentService } from 'src/payment/payment.service';
import { CreateTransactionFormDto } from 'src/payment/dto/create-transaction-form.dto';
import { AuthService } from 'src/auth/auth.service';
import { Ebook } from 'src/ebooks/entities/ebook.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ebookService: EbooksService,
    private readonly paymentService: PaymentService,
    private readonly authService: AuthService,
  ) {}

  async findOrderByReferenceCode(referenceCode: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { referenceCode: referenceCode },
      relations: ['ebooks', 'reader'], 
    });
  }
  async processOrderBooks(order: Order): Promise<void> {
    const readerId = order.user.id; 
    await this.ebookService.addEbooksToReader(readerId, order.ebooks);
  }
  
  async generatePaymentLink(order: Order): Promise<string> {
    const transactionDto = new CreateTransactionFormDto();
    transactionDto.referenceCode = order.referenceCode;
    transactionDto.amount = order.amount;
    transactionDto.buyerEmail = order.user.email;

    return await this.paymentService.generatePaymentLink(transactionDto);

  }
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, ebookIds } = createOrderDto;

    const user = await this.authService.getUserById(userId);
    
    if (!user) {
      throw new Error('Reader not found');
    }
    const ebooks = await this.ebookService.findBy(ebookIds);

    const order = this.orderRepository.create({
      user: user,
      ebooks: ebooks,
      amount: this.calculateTotalAmount(ebooks),  
      purchaseDate: new Date()  
    });

    await this.orderRepository.save(order);
    return order;
  }

  private calculateTotalAmount(ebooks: Ebook[]): number {
    return ebooks.reduce((total, ebook) => total + ebook.price, 0);
  }
}
