import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  merchantId?: string;

  @IsOptional()
  @IsString()
  merchantName?: string;

  @IsOptional()
  @IsString()
  merchantAddress?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
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
