import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class CreateTransactionDto {

  
  @IsString()
  user?: User;

  @IsString()
  merchantId?: string;


  @IsString()
  merchantName?: string;


  @IsString()
  merchantAddress?: string;

 
  @IsString()
  telephone?: string;


  @IsString()
  merchantUrl?: string;

  @IsString()
  transactionState: string;

  @IsString()
  message: string;

  @IsString()
  referenceCode: string;

  @IsString()
  referencePol: string;

  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  paymentMethod: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  tax: number;

  @IsString()
  currency: string;

  @IsString()
  buyerEmail: string;

  @IsOptional()
  @IsString()
  authorizationCode?: string;

  @IsDate()
  processingDate: Date;
}
