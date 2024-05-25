// create-shopping-cart.dto.ts
import { IsUUID, IsArray } from 'class-validator';

export class CreateShoppingCartDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  ebookIds: string[];
}


