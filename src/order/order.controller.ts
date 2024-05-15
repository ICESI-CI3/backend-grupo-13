import { Controller, Post, Body, UseGuards, Get, Req, Param, NotFoundException, Query } from '@nestjs/common';
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
    return await this.orderService.generatePaymentLink(await order);
  }
  
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Get('/:orderId')
  async getUserOrderById(@Req() req,@Param('orderId') orderId: string): Promise<Order> {
    return await this.orderService.getUserOrderById(req.user.userId, orderId);
  }
 
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Get('/')
  async getUserOrders(@Req() req): Promise<Order[]> {
    return await this.orderService.getUserOrders(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:userId/:orderId')  
  async getOfUserOrderById(@Param('orderId') orderId: string,@Param('userId') userId: string): Promise<Order> {
    return await this.orderService.getUserOrderById(userId,orderId);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/all')  
  async getAllOrders( @Query('page') page: string,  @Query('limit') limit: string,): Promise<Order[]> {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  return this.orderService.getAllOrders(pageNumber, limitNumber);
}

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
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
