import { IsString, IsEmail, IsNotEmpty, IsArray, IsOptional, IsNumber, IsInt, MinLength } from 'class-validator';

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
  @IsInt()
  roleId: number;   

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
  @IsInt()
  accessLevel?: number;
}