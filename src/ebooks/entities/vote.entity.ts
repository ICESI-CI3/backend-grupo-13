import { IsNumber, IsPositive } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ebook } from './ebook.entity';
import { User } from 'src/auth/entities/user.entity';


@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number;

  @ManyToOne(() => User, user => user.votes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Ebook, ebook => ebook.votes)
  @JoinColumn({ name: 'ebookId' })
  ebook: Ebook;
}
