import { Controller, Post, Body, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('payu-payment')
  async createPayuPayment(@Body() createPaymentDto: CreatePaymentDto, @Res() res: Response) {
    const paymentData = this.paymentService.generatePaymentLink(createPaymentDto.amount, createPaymentDto.firstName, createPaymentDto.email);
    
    res.send(`hola
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting to Payment...</title>
      </head>
      <body onload="document.getElementById('payuForm').submit();">
          <form id="payuForm" action="${paymentData.url}" method="post">
              <input type="hidden" name="merchantId" value="${process.env.PAYU_MERCHANT_ID}" />
              <input type="hidden" name="accountId" value="${process.env.PAYU_ACCOUNT_ID}" />
              <input type="hidden" name="description" value="Payment for products" />
              <input type="hidden" name="referenceCode" value="${paymentData.txnId}" />
              <input type="hidden" name="amount" value="${paymentData.amount}" />
              <input type="hidden" name="tax" value="0" />
              <input type="hidden" name="taxReturnBase" value="0" />
              <input type="hidden" name="currency" value="USD" />
              <input type="hidden" name="signature" value="${paymentData.hash}" />
              <input type="hidden" name="responseUrl" value="${process.env.PAYU_RESPONSE_URL}" />
              <input type="hidden" name="confirmationUrl" value="${process.env.PAYU_CONFIRMATION_URL}" />
              <input type="hidden" name="buyerEmail" value="${paymentData.email}" />
          </form>
      </body>
      </html>
    `);
  }
}

