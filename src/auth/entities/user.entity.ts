import { Entity, PrimaryGeneratedColumn, Column, TableInheritance, ChildEntity } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  get role(): string {
    return this.constructor.name;
  }
}

@ChildEntity('Reader')
export class Reader extends User {
  get role(): string {
    return 'Reader';
  }

  @Column()
  favoriteGenre: string;

  @Column({ type: 'text' })
  bookList: string;
}

@ChildEntity('Author')
export class Author extends User {
  get role(): string {
    return 'Author';
  }

  @Column()
  penName: string;

  @Column()
  biography: string;

  @Column({ type: 'text' })
  booksWritten: string;
}

@ChildEntity('Admin')
export class Admin extends User {
  get role(): string {
    return 'Admin';
  }

  @Column()
  accessLevel: number;
}
