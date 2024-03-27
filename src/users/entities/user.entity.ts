import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  // Otros campos comunes
}

@Entity()
export class Buyer extends User {
  // Campos específicos para el comprador
}

@Entity()
export class Author extends User {
  // Campos específicos para el autor
}

@Entity()
export class Editorial extends User {
  // Campos específicos para la editorial
}

@Entity()
export class Admin extends User {
  // Campos específicos para el admin
}

