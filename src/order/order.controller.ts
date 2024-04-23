import { Controller, Post, Body, UseGuards, Get, Req, Param, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { Transaction } from 'src/payment/entities/transaction.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Order } from './entities/order.entity';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Post('create')
  async create(@Req() req,@Body() createOrderDto: CreateOrderDto) {
    const order = this.orderService.createOrder(req.user.userId,createOrderDto);
    return this.orderService.generatePaymentLink(await order);
  }
  
  @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get('/:orderId')
   async getUserTransactionById(@Req() req,@Param('orderId') orderId: string): Promise<Order> {
       return this.orderService.getUserOrderById(req.user.userId,orderId);
   }
 
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get('/')
   async getUserTransactions(@Req() req): Promise<Order[]> {
       return this.orderService.getUserOrders(req.user.userId);
   }

   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Roles(RoleEnum.ADMIN)
   @Get('/:userId/:orderId')  
  async getOfUserTransactionById(@Param('orderId') orderId: string,@Param('userId') userId: string): Promise<Order> {
      return await this.orderService.getUserOrderById(userId,orderId);
  }
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/all')  
 async getAllTransactions(): Promise<Order[]> {
     return await this.orderService.getAllOrders();
 }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:id')
  async getTransactionById(@Param('id') id: string): Promise<Order> {
      return await this.orderService.getOrderById(id); 
  }
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Post('create/:id')
  async createForUser(@Param('id') id: string,@Body() createOrderDto: CreateOrderDto) {
    const order = this.orderService.createOrder(id,createOrderDto);
    return this.orderService.generatePaymentLink(await order);
  }

}
