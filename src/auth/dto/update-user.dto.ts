import { IsOptional, IsString, IsEmail, IsArray, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have an Uppercase letter, a lowercase letter, and a number'
  })
  password?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  favoriteGenre?: string;

  @IsOptional()
  @IsString()
  bookList?: string;

  @IsOptional()
  @IsString()
  penName?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
