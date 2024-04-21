import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();


@Injectable()
export class PaymentService {
  private payuMerchantKey = process.env.PAYU_MERCHANT_KEY;
  private payuMerchantSalt = process.env.PAYU_MERCHANT_SALT;
  private payuUrl = process.env.PAYU_URL; 

  generatePaymentLink(amount: number, firstName: string, email: string): any {
    const txnId = uuidv4();
    const hashString = `${this.payuMerchantKey}|${txnId}|${amount}|Product Description|${firstName}|${email}|||||||||||${this.payuMerchantSalt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return {
      url: this.payuUrl,
      txnId: txnId,
      hash: hash,
      amount: amount,
      firstName: firstName,
      email: email
    };
  }
  
}


