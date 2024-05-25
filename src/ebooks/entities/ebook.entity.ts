import { Author } from '../../auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Vote } from './vote.entity';

@Entity()
export class Ebook {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  publisher: string;

  @ManyToOne(() => Author, author => author.booksWritten, {eager: true})
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @Column()
  overview: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  fileData: string;

  @Column({ unique: true })
  isbn: string;

  @Column()
  version: string;

  @Column('float')
  rating: number;

  @Column({
    type: 'enum',
    enum: ['Fantasía', 'Comedia', 'Cuentos clásicos', 'Horror', 'Historia', 'Ciencia ficción', 'Romance', 'Thriller']
  })
  category: string;

  @Column()
  ebookCover: string

  @OneToMany(() => Vote, vote => vote.ebook, { eager: true })
  votes: Vote[];
}

@Entity()
export class EbooksReader{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  readerId:string;

  @Column()
  ebookId:string;
}