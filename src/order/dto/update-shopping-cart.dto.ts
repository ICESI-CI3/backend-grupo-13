// update-shopping-cart.dto.ts
import { PartialType } from '@nestjs/mapped-types';

import { IsArray, IsUUID } from 'class-validator';
import { CreateShoppingCartDto } from './create-shopping-cart.dto';

export class UpdateShoppingCartDto extends PartialType(CreateShoppingCartDto) {
  @IsArray()
  @IsUUID('4', { each: true })
  ebookIds?: string[];
}