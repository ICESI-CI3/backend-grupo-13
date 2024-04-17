import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';


export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string; 

}

@Entity()
export class Reader extends User {
  @Column()
  favoriteGenre: string;

  @Column({ type: "text" })
  bookList: string;

  @BeforeInsert()
  setRole(): void {
    this.role = 'reader';
  }
}

@Entity()
export class Author extends User {
  @Column()
  penName: string;

  @Column()
  biography: string;

  @Column({ type: "text" })
  booksWritten: string; 

  @BeforeInsert()
  setRole(): void {
    this.role = 'author';
  }
}

@Entity()
export class Admin extends User {
  @Column()
  accessLevel: number;

  @BeforeInsert()
  setRole(): void {
    this.role = 'admin';
  }
}


