import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { EbooksService } from 'src/ebooks/ebooks.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ebookService: EbooksService,
  ) {}

  async findOrderByReferenceCode(referenceCode: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { referenceCode: referenceCode },
      relations: ['ebooks', 'reader'], 
    });
  }
  async processOrderBooks(order: Order): Promise<void> {
    const readerId = order.reader.id; 
    await this.ebookService.addEbooksToReader(readerId, order.ebooks);
  }
}
