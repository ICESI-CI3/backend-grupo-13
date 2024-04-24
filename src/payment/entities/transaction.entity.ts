import { User } from '../../auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  merchantId: string;

  @Column()
  merchant_name: string;

  @Column()
  merchant_address: string;

  @Column()
  telephone: string;

  @Column()
  merchant_url: string;

  @Column()
  transactionState: string;

  @Column()
  message: string;

  @Column()
  referenceCode: string;

  @Column()
  reference_pol: string;

  @Column()
  transactionId: string;

  @Column()
  description: string;

  @Column()
  lapPaymentMethod: string;

  @Column({ type: 'float' })
  TX_VALUE: number;

  @Column({ type: 'float' })
  TX_TAX: number;

  @Column()
  currency: string;

  @Column()
  buyerEmail: string;


  @Column({ type: 'date' })
  processingDate: Date;
}
