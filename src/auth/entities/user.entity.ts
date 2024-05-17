import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "../enum/role.enum";
import { Order } from "../../order/entities/order.entity";
import { Vote } from "src/ebooks/entities/vote.entity";
import { Ebook } from "src/ebooks/entities/ebook.entity";

@Entity()
export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ type: 'enum', default: RoleEnum.USER, enum: RoleEnum })
  role: RoleEnum;

  @OneToMany(() => Order, order => order.user, { eager: true })
  orders: Order[];

  @OneToMany(() => Vote, vote => vote.user, { eager: true })
  votes: Vote[];
}

@Entity()
export class Reader {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; 

  @Column()
  favoriteGenre: string;

  @Column({ type: 'text' })
  bookList: string;

}

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; 

  @Column()
  penName: string;

  @Column()
  biography: string;

  @OneToMany(() => Ebook, ebook => ebook.author, { eager: true })
  booksWritten: Ebook[];

}
