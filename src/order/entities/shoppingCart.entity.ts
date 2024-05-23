import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Ebook } from '../../ebooks/entities/ebook.entity';

@Entity('')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.shoppingCart)
  user: User;

  @ManyToMany(() => Ebook)
  @JoinTable({
    name: 'shopping_cart_ebooks',  
    joinColumn: { name: 'shopping_cart_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ebook_id', referencedColumnName: 'id' }
  })
  ebooks: Ebook[];


}
