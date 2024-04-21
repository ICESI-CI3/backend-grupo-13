import { Reader } from 'src/auth/entities/user.entity';
import { Ebook } from 'src/ebooks/entities/ebook.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';


@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  //@ManyToOne(() => Reader, reader => reader.purchases)
  @JoinColumn({ name: 'reader_id' })
  reader: Reader;

 // @ManyToOne(() => Ebook, ebook => ebook.purchases)
  @JoinColumn({ name: 'book_id' })
  ebook: Ebook;

  @CreateDateColumn({ type: 'timestamp' })
  purchaseDate: Date;

  @Column()
  amount: number;

  @Column({ default: 'completed' })
  status: 'pending' | 'completed' | 'failed';
}
