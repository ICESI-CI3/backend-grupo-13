import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author, Reader, User } from '../auth/entities/user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { Ebook, EbooksReader } from '../ebooks/entities/ebook.entity';
import { Wish } from '../ebooks/entities/wish.entity';
import { Order } from '../order/entities/order.entity';
import { Transaction } from '../payment/entities/transaction.entity';
import { Repository } from 'typeorm';
import { Vote } from 'src/ebooks/entities/vote.entity';
import { ShoppingCart } from 'src/shopping_cart/entities/shopping_cart.entity';

import users from './data/users.data';
import authors, { authorsMap } from './data/authors.data';
import ebooks from './data/ebooks.data';
import readers from './data/readers.data';
import orders from './data/orders.data';
import transactions from './data/transactions.data';
import shoppingCarts from './data/shoppingCart.data';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Ebook) private readonly ebookRepository: Repository<Ebook>,
    @InjectRepository(Reader) private readonly readerRepository: Repository<Reader>,
    @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(EbooksReader) private readonly ebookReaderRepository: Repository<EbooksReader>,
    @InjectRepository(ShoppingCart) private readonly shoppingCartRepository: Repository<ShoppingCart>,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    //await this.seedData();
  }

  async seedData() {
    try {
      await Promise.all(users.map(async (user) => {
        await this.userRepository.save(user);
      }));

      await Promise.all(authors.map(async (author) => {
        await this.authorRepository.save(author);
      }));

      await Promise.all(readers.map(async (reader) => {
        await this.readerRepository.save(reader);
      }));

      await Promise.all(ebooks.map(async (ebook) => {
        await this.ebookRepository.save(ebook);
      }));

      await Promise.all(shoppingCarts.map(async (cart) => {
        await this.shoppingCartRepository.save(cart);
      }));

      await Promise.all(orders.map(async (order) => {
        await this.orderRepository.save(order);
      }));

      await Promise.all(transactions.map(async (transaction) => {
        await this.transactionRepository.save(transaction);
      }));

      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error inserting seed data:', error);
    }
  }
}
