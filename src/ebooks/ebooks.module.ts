// ebooks.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EbooksService } from './ebooks.service';
import { EbooksController } from './ebooks.controller';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { AuthModule } from '../auth/auth.module';
import { Wish } from './entities/wish.entity';
import { Vote } from './entities/vote.entity';
import { ShoppingCartModule } from 'src/shopping_cart/shopping_cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ebook, Wish, EbooksReader, Vote]),
  forwardRef(() => AuthModule),
  forwardRef(() => ShoppingCartModule)],
  controllers: [EbooksController],
  providers: [EbooksService],
  exports: [EbooksService],
})
export class EbooksModule {}
