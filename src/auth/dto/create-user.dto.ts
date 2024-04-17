import { IsString, IsEmail, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

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
  booksWritten?: string;

  @IsOptional()
  @IsNumber()
  accessLevel?: number;
}
