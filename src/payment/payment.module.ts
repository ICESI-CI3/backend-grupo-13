import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity'; 
import { EbooksModule } from 'src/ebooks/ebooks.module';
import { ConfigModule } from '@nestjs/config'; 
import { OrderModule } from 'src/order/order.module';
console.log('Initializing PaymentModule');
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]), EbooksModule,ConfigModule,forwardRef(()=>OrderModule)],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
