import { Controller, Post, Body, Res, Get, Query, HttpException, HttpStatus, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Response } from 'express';
import { OrderService } from '../order/order.service';
import { CreateTransactionFormDto } from './dto/create-transaction-form.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService,
    private readonly orderService: OrderService) {}

  @Post('payu-payment')
  async createPayuPayment(@Body() createTransactionFormDto: CreateTransactionFormDto, @Res() res: Response) {
    const paymentData = this.paymentService.generatePaymentLink(createTransactionFormDto);
    res.send(paymentData);
  }
  @Get('payu-response')
  async handleResponse(@Body() transactionData: CreateTransactionDto, @Res() res: Response) {
    try {
      const transaction = await this.paymentService.createTransaction(transactionData);

      if (transactionData.message === 'APPROVED') {
        const order = await this.orderService.findOrderByReferenceCode(transactionData.referenceCode);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      await this.orderService.processOrderBooks(order);
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Failed to process transaction', details: error.message });
    }
  }
  
}
