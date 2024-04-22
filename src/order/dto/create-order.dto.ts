import { IsUUID, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string; 
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  readonly ebookIds: string[];

}
