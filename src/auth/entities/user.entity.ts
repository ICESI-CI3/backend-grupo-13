import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "../enum/role.enum";
import { UUID } from "crypto";

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string; 

  @Column()
  description: string; 
}

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
  id: number;

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
  id: number;

  @Column()
  userId: string; 

  @Column()
  penName: string;

  @Column()
  biography: string;

  @Column({ type: 'text' })
  booksWritten: string;
}
