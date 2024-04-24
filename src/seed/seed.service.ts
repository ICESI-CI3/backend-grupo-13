import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author, Reader, User } from '../auth/entities/user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { Ebook } from '../ebooks/entities/ebook.entity';
import { Wish } from '../ebooks/entities/wish.entity';
import { Order } from '../order/entities/order.entity';
import { Transaction } from '../payment/entities/transaction.entity';
import { Repository } from 'typeorm';


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
  ) {}

  async seedData() {
    // Aquí puedes generar tus datos de prueba y guardarlos en la base de datos
    try {
      // Insertar usuarios
      const user1 = await this.userRepository.save({
        username: 'user1',
        password: 'password1',
        email: 'user1@example.com',
        role: RoleEnum.USER,
      });
      const user2 = await this.userRepository.save({
        username: 'user2',
        password: 'password2',
        email: 'user2@example.com',
        role: RoleEnum.USER,
      });

      // Insertar autores
      const author1 = await this.authorRepository.save({
        userId: user1.id,
        penName: 'Author1',
        biography: 'Biography of Author1',
        booksWritten: 'Books by Author1',
      });

      // Insertar lectores
      const reader1 = await this.readerRepository.save({
        userId: user2.id,
        favoriteGenre: 'Fiction',
        bookList: 'List of favorite books',
      });

      // Insertar ebooks
      const ebook1 = await this.ebookRepository.save({
        title: 'Ebook1',
        publisher: 'Publisher1',
        author: author1,
        overview: 'Overview of Ebook1',
        price: 20000,
        stock: 100,
        fileData: []
      });

      // Insertar orden
      const order1 = await this.orderRepository.save({
        referenceCode: 'order1',
        user: user1,
        ebooks: [ebook1],
        purchaseDate: new Date(),
        amount: 10000,
      });

      // Insertar transacción
      const transaction1 = await this.transactionRepository.save({
        user: user1,
        merchantId: 'merchant1',
        merchant_name: 'Merchant1',
        merchant_address: 'Address1',
        telephone: '123456789',
        merchant_url: 'http://merchant1.com',
        transactionState: 'APPROVED',
        message: 'Transaction successful',
        referenceCode: 'order1',
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

      console.log('Seed data inserted successfully.');
    } catch (error) {
      
    }
  }
}
