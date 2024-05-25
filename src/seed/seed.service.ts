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

import users from './data/users.data';
import authors, { authorsMap } from './data/authors.data';
import ebooks from './data/ebooks.data';

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
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    await this.seedData();
  }

  async seedData() {
    try {
      await Promise.all(users.map(async (user) => {
        await this.userRepository.save(user);
      }));

      await Promise.all(authors.map(async (author) => {
        await this.authorRepository.save(author);
      }));

      await Promise.all(ebooks.map(async (ebook) => {
        await this.ebookRepository.save(ebook);
      }));

      // const user1 = await this.userRepository.save({
      //   username: 'user1',
      //   password: 'password1',
      //   email: 'user1@example.com',
      //   role: RoleEnum.USER,
      // });
      // const user2 = await this.userRepository.save({
      //   username: 'user2',
      //   password: 'password2',
      //   email: 'user2@example.com',
      //   role: RoleEnum.USER,
      // });
      // const author1 = await this.authorRepository.save({
      //   userId: user1.id,
      //   penName: 'Author1',
      //   biography: 'Biography of Author1',
      //   booksWritten: [],
      // });
      // const reader1 = await this.readerRepository.save({
      //   userId: user2.id,
      //   favoriteGenre: 'Fiction',
      //   bookList: 'List of favorite books',
      // });
      // const ebook1 = await this.ebookRepository.save({
      //   title: 'Ebook1',
      //   publisher: 'Publisher1',
      //   author: author1,
      //   overview: 'Overview of Ebook1',
      //   price: 20000,
      //   stock: 100,
      //   fileData: "",
      //   isbn: '978-3-16-148410-0', 
      //   version: "1",
      //   rating: 3,
      //   votes: []
      // });
      // const order1 = await this.orderRepository.save({
      //   referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
      //   user: user1,
      //   ebooks: [ebook1],
      //   purchaseDate: new Date(),
      //   amount: 10000,
      // });
      // const transaction1 = await this.transactionRepository.save({
      //   user: user1,
      //   merchantId: 'merchant1',
      //   merchant_name: 'Merchant1',
      //   merchant_address: 'Address1',
      //   telephone: '123456789',
      //   merchant_url: 'http://merchant1.com',
      //   transactionState: 'APPROVED',
      //   message: 'Transaction successful',
      //   referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
      //   reference_pol: 'reference_pol',
      //   transactionId: 'transaction1',
      //   description: 'Transaction description',
      //   lapPaymentMethod: 'Credit Card',
      //   TX_VALUE: 20000,
      //   TX_TAX: 0,
      //   currency: 'USD',
      //   buyerEmail: 'user1@example.com',
      //   processingDate: new Date(),
      // });

      // const wish1 = await this.wishRepository.save({
      //   reader: reader1,
      //   ebook: ebook1,
      // });

      // const vote1 = await this.voteRepository.save({
      //   value: 5,
      //   user: user2,
      //   ebook: ebook1,
      // });

      // const ebookreader = await this.ebookReaderRepository.save({
      //   id: "4965777e-0bc7-426c-80d1-663a2efa31ed",
      //   readerId: user1.id,
      //   ebookId: ebook1.id
      // })


      // const users = await this.userRepository.save([
      //   {
      //     username: 'user3',
      //     password: 'password3',
      //     email: 'user3@example.com',
      //     role: RoleEnum.USER,
      //   },
      //   {
      //     username: 'user4',
      //     password: 'password4',
      //     email: 'user4@example.com',
      //     role: RoleEnum.USER,
      //   },
      // ]);

      // const authors = await this.authorRepository.save([
      //   {
      //     userId: users[0].id,
      //     penName: 'Author2',
      //     biography: 'Biography of Author2',
      //     booksWritten: [],
      //   },
      //   {
      //     userId: users[1].id,
      //     penName: 'Author3',
      //     biography: 'Biography of Author3',
      //     booksWritten: [],
      //   },
      // ]);

      // const readers = await this.readerRepository.save([
      //   {
      //     userId: users[0].id,
      //     favoriteGenre: 'Non-Fiction',
      //     bookList: 'List of non-fiction books',
      //   },
      //   {
      //     userId: users[1].id,
      //     favoriteGenre: 'Science Fiction',
      //     bookList: 'List of science fiction books',
      //   },
      // ]);

      // const ebooks = await this.ebookRepository.save([
      //   {
      //     title: 'Ebook2',
      //     publisher: 'Publisher2',
      //     author: authors[0],
      //     overview: 'Overview of Ebook2',
      //     price: 15000,
      //     stock: 50,
      //     fileData: "",
      //     isbn: '978-1-23-456789-0',
      //     version: "1",
      //     rating: 4,
      //     votes: [],
      //   },
      //   {
      //     title: 'Ebook3',
      //     publisher: 'Publisher3',
      //     author: authors[1],
      //     overview: 'Overview of Ebook3',
      //     price: 25000,
      //     stock: 75,
      //     fileData: "",
      //     isbn: '978-0-12-345678-9',
      //     version: "1",
      //     rating: 5,
      //     votes: [],
      //   },
      // ]);

      // const orders = await this.orderRepository.save([
      //   {
      //     referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
      //     user: users[0],
      //     ebooks: [ebooks[0]],
      //     purchaseDate: new Date(),
      //     amount: 15000,
      //   },
      //   {
      //     referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
      //     user: users[1],
      //     ebooks: [ebooks[1]],
      //     purchaseDate: new Date(),
      //     amount: 25000,
      //   },
      // ]);

      // const transactions = await this.transactionRepository.save([
      //   {
      //     user: users[0],
      //     merchantId: 'merchant2',
      //     merchant_name: 'Merchant2',
      //     merchant_address: 'Address2',
      //     telephone: '987654321',
      //     merchant_url: 'http://merchant2.com',
      //     transactionState: 'APPROVED',
      //     message: 'Transaction successful',
      //     referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
      //     reference_pol: 'reference_pol2',
      //     transactionId: 'transaction2',
      //     description: 'Transaction description 2',
      //     lapPaymentMethod: 'Credit Card',
      //     TX_VALUE: 15000,
      //     TX_TAX: 0,
      //     currency: 'USD',
      //     buyerEmail: 'user3@example.com',
      //     processingDate: new Date(),
      //   },
      //   {
      //     user: users[1],
      //     merchantId: 'merchant3',
      //     merchant_name: 'Merchant3',
      //     merchant_address: 'Address3',
      //     telephone: '1122334455',
      //     merchant_url: 'http://merchant3.com',
      //     transactionState: 'APPROVED',
      //     message: 'Transaction successful',
      //     referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
      //     reference_pol: 'reference_pol3',
      //     transactionId: 'transaction3',
      //     description: 'Transaction description 3',
      //     lapPaymentMethod: 'PayPal',
      //     TX_VALUE: 25000,
      //     TX_TAX: 0,
      //     currency: 'USD',
      //     buyerEmail: 'user4@example.com',
      //     processingDate: new Date(),
      //   },
      // ]);

      // const wishes = await this.wishRepository.save([
      //   {
      //     reader: readers[0],
      //     ebook: ebooks[0],
      //   },
      //   {
      //     reader: readers[1],
      //     ebook: ebooks[1],
      //   },
      // ]);

      // const votes = await this.voteRepository.save([
      //   {
      //     value: 3,
      //     user: users[0],
      //     ebook: ebooks[0],
      //   },
      //   {
      //     value: 4,
      //     user: users[1],
      //     ebook: ebooks[1],
      //   },
      // ]);

      // const ebooksReaders = await this.ebookReaderRepository.save([
      //   {
      //     readerId: users[0].id,
      //     ebookId: ebooks[0].id,
      //   },
      //   {
      //     readerId: users[1].id,
      //     ebookId: ebooks[1].id,
      //   },
      // ]);

      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error inserting seed data:', error);
    }
  }
}
