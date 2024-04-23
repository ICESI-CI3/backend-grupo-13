import { Controller, Post, Body, Res, Get, Query, HttpException, HttpStatus, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Response } from 'express';
import { CreateTransactionFormDto } from './dto/create-transaction-form.dto';
import { Transaction } from './entities/transaction.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';


@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
   ) {}
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get('/transactions/:transactionsId')
   async getUserTransactionById(@Req() req,@Param('transactionsId') transactionsId: string): Promise<Transaction> {
       return this.paymentService.getUserTransactionById(req.user.userId,transactionsId);
   }
 
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get('/transactions')
   async getUserTransactions(@Req() req): Promise<Transaction[]> {
       return this.paymentService.getUserTransactions(req.user.userId);
   }

  //Funciona para cuando el usuario le da el boton de mirar volver a pagina despues de que se acaba la transaccion en payu
  @Get('payu-response')
  async handleResponse(@Query() transactionData: CreateTransactionDto, @Res() res: Response) {
    console.log("Response")
    try {
      if (transactionData.message === 'APPROVED') {
        const order = await this.paymentService.findOrderByReferenceCode(transactionData.referenceCode);
        transactionData.user = order.user
        const transaction = await this.paymentService.createTransaction(transactionData);
        
      if (!order) {
        throw new Error('Order not found');
      }
      
      await this.paymentService.processOrderBooks(order);
      
      return  res.json(transaction);
    }
    return  res.json({message: 'Transaccion no aprovada'});
    } catch (error) {
      res.status(500).json({ message: 'Failed to process transaction', details: error.message });
    }
  }
  //Funciona cuando el servidor de payu asincronicamente le informa al servidor de la confirmacion de la transaccion
  @Get('payu-confirmation')
  async handleConfirmation(@Query() transactionData: CreateTransactionDto, @Res() res: Response) {
    console.log("confirmation")
    try {
      if (transactionData.message === 'APPROVED') {
        const transaction = await this.paymentService.createTransaction(transactionData);
        const order = await this.paymentService.findOrderByReferenceCode(transactionData.referenceCode);
        

      if (!order) {
        throw new Error('Order not found');
      }
      
      await this.paymentService.processOrderBooks(order);
      
      return  res.json(transaction);
    }
    return  res.json({message: 'Transaccion no aprovada'});
    } catch (error) {
      res.status(500).json({ message: 'Failed to process transaction', details: error.message });
    }
  }
  @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Roles(RoleEnum.ADMIN)
   @Get()  
  async getAllTransactions(): Promise<Transaction[]> {
      return await this.paymentService.getAllTransactions();
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<Transaction> {
      return await this.paymentService.getTransactionById(id);
  }
}
