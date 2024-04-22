import { IsUUID, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  readonly readerId: string; 
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  readonly ebookIds: string[];

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number; 
}
