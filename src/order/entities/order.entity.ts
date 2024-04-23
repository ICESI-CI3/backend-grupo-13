import { User } from '../../auth/entities/user.entity';
import { Ebook } from '../../ebooks/entities/ebook.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  referenceCode: string;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Ebook)
  @JoinTable({
    name: 'order_ebooks',  
    joinColumn: { name: 'order_id', referencedColumnName: 'referenceCode' },
    inverseJoinColumn: { name: 'ebook_id', referencedColumnName: 'id' }
  })
  ebooks: Ebook[];

  @CreateDateColumn({ type: 'timestamp' })
  purchaseDate: Date;

  @Column({ type: 'float' })
  amount: number;
}
