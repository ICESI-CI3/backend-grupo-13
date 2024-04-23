import { Controller, Post, Body, Res, Get, Query, HttpException, HttpStatus, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Response } from 'express';
import { CreateTransactionFormDto } from './dto/create-transaction-form.dto';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
   ) {}

  @Post('payu-payment')
  async createPayuPayment(@Body() createTransactionFormDto: CreateTransactionFormDto, @Res() res: Response) {
    const paymentData = this.paymentService.generatePaymentLink(createTransactionFormDto);
    res.send(paymentData);
  }
  @Get('payu-response')
  async handleResponse(@Query() transactionData: CreateTransactionDto, @Res() res: Response) {

    try {
      if (transactionData.message === 'APPROVED') {
        const transaction = await this.paymentService.createTransaction(transactionData);
        const order = await this.paymentService.findOrderByReferenceCode(transactionData.referenceCode);
        

      if (!order) {
        throw new Error('Order not found');
      }
      
      await this.paymentService.processOrderBooks(order);
      
      res.json(transaction);
    }
    res.json({message: 'Transaccion no aprovada'});
    } catch (error) {
      res.status(500).json({ message: 'Failed to process transaction', details: error.message });
    }
  }
  
}
