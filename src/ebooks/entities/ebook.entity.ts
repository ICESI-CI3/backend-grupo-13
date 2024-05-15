import { Author } from '../../auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Ebook {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  publisher: string;

  @ManyToOne(() => Author)
  @JoinColumn()
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