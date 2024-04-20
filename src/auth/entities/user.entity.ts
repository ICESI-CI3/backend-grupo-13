import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @ManyToOne(type => Role)
  @JoinColumn({ name: "roleId" }) 
  role: Role;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; 

  @Column()
  description: string; 
}


@Entity()
export class Reader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; 
  @Column()
  favoriteGenre: string;

  @Column({ type: 'text' })
  bookList: string;
}

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; 

  @Column()
  penName: string;

  @Column()
  biography: string;

  @Column({ type: 'text' })
  booksWritten: string;
}

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; 

  @Column()
  accessLevel: number;
}

