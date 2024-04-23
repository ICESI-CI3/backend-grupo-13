import { Controller, Post, Body, UseGuards, Get, Req, Param, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { Transaction } from 'src/payment/entities/transaction.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = this.orderService.createOrder(createOrderDto);
    return this.orderService.generatePaymentLink(await order);
  }
  
  @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get(':orderId')
   async getUserTransactionById(@Req() req,@Param('orderId') orderId: string): Promise<Order> {
       return this.orderService.getUserOrderById(req.user.userId,orderId);
   }
 
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get()
   async getUserTransactions(@Req() req): Promise<Order[]> {
       return this.orderService.getUserOrders(req.user.userId);
   }

   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Roles(RoleEnum.ADMIN)
   @Get('/all')  
  async getAllTransactions(): Promise<Order[]> {
      return await this.orderService.getAllOrders();
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<Order> {
      return await this.orderService.getOrderById(id); 
  }

}
