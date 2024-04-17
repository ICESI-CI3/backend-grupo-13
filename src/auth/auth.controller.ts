import { Controller, Post, Body, Get, UseGuards, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{ access_token: string }> {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    return this.authService.login(loginUserDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/status')
  async checkAuthStatus(@Req() req): Promise<{ access_token: string }> {
      return this.authService.checkAuthStatus(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<User | undefined> {
      return this.authService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAllUsers(): Promise<User[]> {
      return this.authService.getAllUsers();
  }
  
}
