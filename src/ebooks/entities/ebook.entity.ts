import { Author } from '../../auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Ebook {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  publisher: string;

  @OneToOne(() => Author)
  @JoinColumn()
  author: Author;

  @Column()
  overview: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column({
    type: 'bytea',
  })
  fileData: Uint8Array;
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