import { HttpException, HttpStatus, Inject, Injectable, forwardRef, UseGuards, Get, Req, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { EbooksService } from 'src/ebooks/ebooks.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentService } from 'src/payment/payment.service';
import { CreateTransactionFormDto } from 'src/payment/dto/create-transaction-form.dto';
import { AuthService } from 'src/auth/auth.service';
import { Ebook } from 'src/ebooks/entities/ebook.entity';
import { validateUuid } from '../utils/validateUuid';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ebookService: EbooksService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly authService: AuthService,
  ) {}

  async findOrderByReferenceCode(referenceCode: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { referenceCode: referenceCode },
      relations: ['ebooks', 'user'], 
    });
  }
  async processOrderBooks(order: Order): Promise<void> {
    const userId = order.user.id; 
    await this.ebookService.addEbooksToReader(userId, order.ebooks);
  }
  
  async generatePaymentLink(order: Order): Promise<string> {
    const transactionDto = new CreateTransactionFormDto();
    transactionDto.referenceCode = order.referenceCode;
    transactionDto.amount = order.amount;
    transactionDto.buyerEmail = order.user.email;

    return await this.paymentService.generatePaymentLink(transactionDto);

  }
  async createOrder(userId:string,createOrderDto: CreateOrderDto): Promise<Order> {
    try {
        const { ebookIds } = createOrderDto;
        validateUuid(userId);
        for (const book of ebookIds) {
            validateUuid(book);
        }
        const user = await this.authService.getUserById(userId);
        
        if (!user) {
            throw new Error('Reader not found');
        }

        const ownedEbookIds = await this.ebookService.findAllEbooksByReader(userId);
        const ebooksToPurchaseIds = ebookIds.filter(id => 
          !ownedEbookIds.some(ebook => ebook.id === id)
        );
        

        if (ebooksToPurchaseIds.length === 0) {
            throw new Error('All requested eBooks are already owned');
        }

        const ebooks = await this.ebookService.findBy(ebooksToPurchaseIds);

        if (ebooks.length !== ebooksToPurchaseIds.length) {
            throw new Error('Not all requested eBooks are available');
        }

        const order = this.orderRepository.create({
            user: user,
            ebooks: ebooks,
            amount: this.calculateTotalAmount(ebooks),  
            purchaseDate: new Date()
        });

        await this.orderRepository.save(order);
        return order;
    } catch (error) {
        console.error(error.message); 
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, HttpStatus.BAD_REQUEST);
    }
}

  private calculateTotalAmount(ebooks: Ebook[]): number {
    return ebooks.reduce((total, ebook) => total + ebook.price, 0);
  }
  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getOrderById(id: string): Promise<Order> {
    try {
        validateUuid(id);

        const order = await this.orderRepository.findOne({ where: { referenceCode: id },
          relations: ['user', 'ebooks'] });

        if (!order) {
            throw new NotFoundException(` Order with ID ${id} not found.`);
        }
        return order;
    } catch (error) {
        console.error(`Error finding order by ID: ${error.message}`);
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: `Error finding order: ${error.message}`,
        }, HttpStatus.BAD_REQUEST);
    }
    
}
async getUserOrders(userId: string): Promise<Order[]> {
  try {
    validateUuid(userId);
  const orders = await this.orderRepository.find({where: {user: { id: userId }},
    relations: ['user', 'ebooks']  });
  if (!orders) {
      throw new NotFoundException(`Transactions for user ID ${userId} not found.`);
  }
  return orders;
} catch (error) {
  console.error(`Error finding order by ID: ${error.message}`);
  throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: `Error finding order: ${error.message}`,
  }, HttpStatus.BAD_REQUEST);
}
}


async getUserOrderById(userId: string, orderId: string): Promise<Order> {
  try {
    validateUuid(userId);
    validateUuid(orderId);
  const order = await this.orderRepository.findOne({where: { referenceCode: orderId, user: { id: userId } },
    relations: ['user', 'ebooks']});
  if (!order) {
      throw new NotFoundException(` Order with ID ${orderId} for user ID ${userId} not found.`);
  }
  return order;
} catch (error) {
  console.error(`Error finding order by ID: ${error.message}`);
  throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: `Error finding order: ${error.message}`,
  }, HttpStatus.BAD_REQUEST);
}
}
  
}
