import { Controller, Post, Body, UseGuards, Get, Req, Param, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleEnum } from '../auth/enum/role.enum';
import { Roles } from '../auth/decorator/roles.decorator';
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
   async getUserOrderById(@Req() req,@Param('orderId') orderId: string): Promise<Order> {
    const order = await this.orderService.getUserOrderById(req.user.userId, orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
    return order;
   }
 
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get('/')
   async getUserOrders(@Req() req): Promise<Order[]> {
        const order = await this.orderService.getUserOrders(req.user.userId);
      if (!order) {
        throw new NotFoundException(`Not Found orders by user ${req.user.userId}`);
      }
      return order;

   }

   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Roles(RoleEnum.ADMIN)
   @Get('/:userId/:orderId')  
  async getOfUserOrderById(@Param('orderId') orderId: string,@Param('userId') userId: string): Promise<Order> {
    const order =  this.orderService.getUserOrderById(userId,orderId);
    if (!order) {
      throw new NotFoundException(`Not Found orders by user ${userId}`);
    }
    return order;
  }
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/all')  
 async getAllOrders(): Promise<Order[]> {
     return await this.orderService.getAllOrders();
 }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
      const order = await this.orderService.getOrderById(id); 
      if (!order) {
        throw new NotFoundException(`Not Found orders by user ${id}`);
      }
      return order;
  }
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Post('create/:id')
  async createForUser(@Param('id') id: string,@Body() createOrderDto: CreateOrderDto) {
    const order = this.orderService.createOrder(id,createOrderDto);
    return this.orderService.generatePaymentLink(await order);
  }

}
