import { Injectable } from '@nestjs/common';
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

@Injectable()
export class SeederService {
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
  ) {}

  async seedData() {
    try {

      
      const user1 = await this.userRepository.save({
        username: 'user1',
        password: 'password1',
        email: 'user1@example.com',
        role: RoleEnum.USER,
      });
      const shoppingCart1 = await this.shoppingCartRepository.save({
        user: user1,
      })
      user1.shoppingCart=shoppingCart1;
      await this.userRepository.save(user1);

      const user2 = await this.userRepository.save({
        username: 'user2',
        password: 'password2',
        email: 'user2@example.com',
        role: RoleEnum.USER,
      });
      const shoppingCart2 = await this.shoppingCartRepository.save({
        user: user2,
      })
      user2.shoppingCart=shoppingCart2;
      await this.userRepository.save(user2);

      const author1 = await this.authorRepository.save({
        userId: user1.id,
        penName: 'Author1',
        biography: 'Biography of Author1',
        booksWritten: [],
      });
      const reader1 = await this.readerRepository.save({
        userId: user2.id,
        favoriteGenre: 'Fiction',
        bookList: 'List of favorite books',
      });
      const ebook1 = await this.ebookRepository.save({
        title: 'Ebook1',
        publisher: 'Publisher1',
        author: author1,
        overview: 'Overview of Ebook1',
        price: 20000,
        stock: 100,
        fileData: "",
        isbn: '978-3-16-148410-0', 
        version: "1",
        rating: 3,
        votes: [],
        category: "horror"
      });
      const order1 = await this.orderRepository.save({
        referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
        user: user1,
        ebooks: [ebook1],
        purchaseDate: new Date(),
        amount: 10000,
      });
      const transaction1 = await this.transactionRepository.save({
        user: user1,
        merchantId: 'merchant1',
        merchant_name: 'Merchant1',
        merchant_address: 'Address1',
        telephone: '123456789',
        merchant_url: 'http://merchant1.com',
        transactionState: 'APPROVED',
        message: 'Transaction successful',
        referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
        reference_pol: 'reference_pol',
        transactionId: 'transaction1',
        description: 'Transaction description',
        lapPaymentMethod: 'Credit Card',
        TX_VALUE: 20000,
        TX_TAX: 0,
        currency: 'USD',
        buyerEmail: 'user1@example.com',
        processingDate: new Date(),
      });

      const wish1 = await this.wishRepository.save({
        reader: reader1,
        ebook: ebook1,
      });

      const vote1 = await this.voteRepository.save({
        value: 5,
        user: user2,
        ebook: ebook1,
      });

      const ebookreader = await this.ebookReaderRepository.save({
        id: "4965777e-0bc7-426c-80d1-663a2efa31ed",
        readerId: user1.id,
        ebookId: ebook1.id
      })


      const wishes = await this.wishRepository.save([
        {
          reader: user1,
          ebook: ebook1,
        }
      ]);

      const votes = await this.voteRepository.save([
        {
          value: 3,
          user: user1,
          ebook: ebook1,
        }
      ]);

      

      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error inserting seed data:', error);
    }
  }
}
