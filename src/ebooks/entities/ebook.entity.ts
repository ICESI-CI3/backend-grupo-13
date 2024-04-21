import { Author } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Ebook {
  @PrimaryGeneratedColumn()
  id: number;

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