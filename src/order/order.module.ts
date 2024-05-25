import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EbooksModule } from '../ebooks/ebooks.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payment.module';
import { ShoppingCartModule } from 'src/shopping_cart/shopping_cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]),EbooksModule, forwardRef(()=>PaymentModule), forwardRef(() => AuthModule),],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
