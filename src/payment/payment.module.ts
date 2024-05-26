import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity'; 
import { EbooksModule } from '../ebooks/ebooks.module';
import { ConfigModule } from '@nestjs/config'; 
import { OrderModule } from '../order/order.module';
import { ShoppingCartModule } from 'src/shopping_cart/shopping_cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),ConfigModule,forwardRef(()=>ShoppingCartModule),forwardRef(()=>OrderModule)],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
