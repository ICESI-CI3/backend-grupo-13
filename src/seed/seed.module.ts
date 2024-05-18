import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederController } from './seed.controller';
import { Author, Reader, User } from '../auth/entities/user.entity';
import { Ebook, EbooksReader } from '../ebooks/entities/ebook.entity';
import { Order } from '../order/entities/order.entity';

import { Wish } from '../ebooks/entities/wish.entity';
import { SeederService } from './seed.service';
import { Transaction } from '../payment/entities/transaction.entity';
import { Vote } from 'src/ebooks/entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Author, Reader,Order, Transaction, Ebook, Wish, Vote,EbooksReader,
    ]),
  ],
  providers: [SeederService],
  controllers: [SeederController],
})
export class SeederModule {}
