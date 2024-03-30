import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
  
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

}

@Entity()
export class Reader extends User {
  @Column()
  favoriteGenre: string;

  @Column({ type: "text" })
  bookList: string;
}

@Entity()
export class Author extends User {
  @Column()
  penName: string;

  @Column()
  biography: string;

  @Column({ type: "text" })
  booksWritten: string; 
}

@Entity()
export class Admin extends User {
  @Column()
  accessLevel: number;
}

