import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "../enum/role.enum";
import { Order } from "../../order/entities/order.entity";
import { Vote } from "src/ebooks/entities/vote.entity";

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

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Vote, vote => vote.user)
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

  @Column({ type: 'text' })
  booksWritten: string;

}
