import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "../enum/role.enum";
import { Order } from "src/order/entities/order.entity";

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

  orders: Order[];
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

  orders: Order[];
}
