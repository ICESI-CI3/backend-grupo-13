import { Controller, Post, Body, Res, Get, Query, HttpException, HttpStatus, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Response } from 'express';
import { CreateTransactionFormDto } from './dto/create-transaction-form.dto';
import { Transaction } from './entities/transaction.entity';
import { Roles } from '../auth/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from '../auth/enum/role.enum';
import { RolesGuard } from '../auth/guard/roles.guard';


@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
   ) {}
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get('/transactions/:transactionsId')
   async getUserTransactionById(@Req() req,@Param('transactionsId') transactionsId: string): Promise<Transaction> {
       return await this.paymentService.getUserTransactionById(req.user.userId,transactionsId);
   }
 
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Get('/transactions')
   async getUserTransactions(@Req() req, @Query('page') page: string,    @Query('limit') limit: string,  ): Promise<Transaction[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return await this.paymentService.getUserTransactions(req.user.userId,pageNumber, limitNumber);
   }

  //Funciona para cuando el usuario le da el boton de mirar volver a pagina despues de que se acaba la transaccion en payu
  @Get('payu-response')
  async handleResponse(@Query() transactionData: CreateTransactionDto, @Res() res: Response) {
    console.log("response")
    return await this.paymentService.handleResponse(transactionData,res);
  }

  //Funciona cuando el servidor de payu asincronicamente le informa al servidor de la confirmacion de la transaccion
  @Get('payu-confirmation')
  async handleConfirmation(@Query() transactionData: CreateTransactionDto, @Res() res: Response) {
    console.log("confirmation")
    return await this.paymentService.handleConfirmation(transactionData,res);
  }
  
  @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Roles(RoleEnum.ADMIN)
   @Get()  
  async getAllTransactions( @Query('page') page: string,    @Query('limit') limit: string,  ): Promise<Transaction[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.paymentService.getAllTransactions(pageNumber, limitNumber);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:id')
  async getTransactionById( @Param('userId') userId: string,  @Query('page') page: string,  @Query('limit') limit: string,): Promise<Transaction[]> {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  return this.paymentService.getUserTransactions(userId, pageNumber, limitNumber);
}
}
