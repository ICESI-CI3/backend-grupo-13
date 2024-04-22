import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('buy')
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = this.orderService.createOrder(createOrderDto);
    return this.orderService.generatePaymentLink(await order);
  }

}
