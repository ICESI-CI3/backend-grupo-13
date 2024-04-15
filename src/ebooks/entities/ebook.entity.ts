import { Author, User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Ebook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  publisher: string;

  @OneToOne(() => User)
  @JoinColumn()
  author: User;

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