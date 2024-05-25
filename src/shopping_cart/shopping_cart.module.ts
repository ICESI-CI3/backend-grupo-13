import { Module, forwardRef } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { ShoppingCartController } from './shopping_cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { EbooksModule } from 'src/ebooks/ebooks.module';
import { AuthModule } from 'src/auth/auth.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCart]), forwardRef(()=>EbooksModule),forwardRef(()=>OrderModule)],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService]
})
export class ShoppingCartModule {}
