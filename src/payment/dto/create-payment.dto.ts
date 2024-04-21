import { IsNotEmpty, IsEmail, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    readonly amount: number; 

    @IsNotEmpty()
    readonly firstName: string; 

    @IsNotEmpty()
    @IsEmail()
    readonly email: string; 
}
