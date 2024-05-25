import { User } from "src/auth/entities/user.entity";
import { Ebook } from "src/ebooks/entities/ebook.entity";
import { Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
