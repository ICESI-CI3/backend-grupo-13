import { IsNotEmpty, IsString, IsUUID, IsNumber, IsOptional, IsISBN, IsPositive } from 'class-validator';


export class CreateEbookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  overview: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @IsNotEmpty()
  @IsString()
  fileData: string;

  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @IsNotEmpty()
  @IsString()
  version: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}