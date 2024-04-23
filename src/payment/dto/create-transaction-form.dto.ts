import { IsString, IsNumber } from 'class-validator';

export class CreateTransactionFormDto {

  @IsString()
  referenceCode: string;

  @IsNumber()
  amount: number;


  @IsString()
  buyerEmail: string;

}