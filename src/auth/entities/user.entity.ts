import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "roleId" }) 
  role: Role;
}



@Entity()
export class Reader {
  @PrimaryGeneratedColumn('uuid')
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
  @PrimaryGeneratedColumn('uuid')
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
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  userId: number; 

  @Column()
  accessLevel: number;
}

