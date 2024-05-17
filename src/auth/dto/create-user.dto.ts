import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, MinLength } from 'class-validator';
import { Ebook } from 'src/ebooks/entities/ebook.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;   

  @IsOptional()
  @IsString()
  favoriteGenre?: string;

  @IsOptional()
  @IsString()
  bookList?: string;

  @IsOptional()
  @IsString()
  penName?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  booksWritten?: Ebook[];

  @IsOptional()
  @IsInt()
  accessLevel?: number;
}