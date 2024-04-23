import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EbooksService } from './ebooks.service';
import { EbooksController } from './ebooks.controller';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { AuthModule } from '../auth/auth.module';
import { Wish } from './entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ebook, Wish, EbooksReader]), AuthModule],
  controllers: [EbooksController],
  providers: [EbooksService],
  exports: [EbooksService]
})
export class EbooksModule { }
