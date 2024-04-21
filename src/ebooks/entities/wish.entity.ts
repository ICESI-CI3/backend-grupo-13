import { Reader } from 'src/auth/entities/user.entity';
import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { Ebook } from './ebook.entity';

@Entity()
export class Wish {
    @OneToOne(() => Reader)
    @JoinColumn()
    reader: Reader;

    @OneToOne(() => Ebook)
    @JoinColumn()
    ebook: Ebook;
}