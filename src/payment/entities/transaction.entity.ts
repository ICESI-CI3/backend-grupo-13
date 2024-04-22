import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchantId: string;

  @Column()
  merchantName: string;

  @Column()
  merchantAddress: string;

  @Column()
  telephone: string;

  @Column()
  merchantUrl: string;

  @Column()
  transactionState: string;

  @Column()
  message: string;

  @Column()
  referenceCode: string;

  @Column()
  referencePol: string;

  @Column()
  transactionId: string;

  @Column()
  description: string;

  @Column()
  paymentMethod: string;

  @Column()
  amount: number;

  @Column()
  tax: number;

  @Column()
  currency: string;

  @Column()
  buyerEmail: string;

  @Column()
  authorizationCode: string;

  @Column({ type: 'date' })
  processingDate: Date;
}
