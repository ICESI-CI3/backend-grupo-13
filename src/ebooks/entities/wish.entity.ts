import { Reader } from '../../auth/entities/user.entity';
import { Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Ebook } from './ebook.entity';

@Entity()
export class Wish {
    @PrimaryGeneratedColumn('increment')
    public id: number;
    
    @OneToOne(() => Reader)
    @JoinColumn()
    reader: Reader;

    @OneToOne(() => Ebook)
    @JoinColumn()
    ebook: Ebook;
}