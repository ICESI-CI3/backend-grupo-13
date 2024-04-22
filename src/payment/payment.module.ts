import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { EbooksService } from 'src/ebooks/ebooks.service';
import { OrderService } from 'src/order/order.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [EbooksService,OrderService]
})
export class PaymentModule {}
