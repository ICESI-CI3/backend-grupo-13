import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from "bcrypt";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly usersService:UsersService) {}

    @Post('login')
    async login(@Body() useDto: CreateUserDto) {
        const user = await this.authService.validateUser(useDto.username, useDto.password);

        if (!user) {
        throw new UnauthorizedException('Invalid username or password');
        }

        return this.authService.login(user);
    }

    @Post('signup')
    public async signup(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
        const userExists = await this.usersService.findByUsername(createUserDto.username);

        if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create(createUserDto);

        const { password, ...result } = user;
        return result;

    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

}
