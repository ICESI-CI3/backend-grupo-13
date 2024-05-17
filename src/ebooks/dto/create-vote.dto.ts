import { IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  value: number;
}
