import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederController } from './seed.controller';
import { Author, Reader, User } from 'src/auth/entities/user.entity';
import { Ebook } from 'src/ebooks/entities/ebook.entity';
import { Order } from 'src/order/entities/order.entity';

import { Wish } from 'src/ebooks/entities/wish.entity';
import { SeederService } from './seed.service';
import { Transaction } from 'src/payment/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Author, Reader,Order, Transaction, Ebook, Wish
    ]),
  ],
  providers: [SeederService],
  controllers: [SeederController],
})
export class SeederModule {}
