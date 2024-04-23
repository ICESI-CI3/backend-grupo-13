import { Controller, Post, Body, Get, UseGuards, Req, Param, HttpException, Delete, HttpStatus, NotFoundException, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './guard/roles.guard';
import { RoleEnum } from './enum/role.enum';
import { Roles } from './decorator/roles.decorator';

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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
      return this.authService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/')
  async getAllUsers(): Promise<User[]> {
      return this.authService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.authService.getUserById(id);
    if (!user) {
      throw new NotFoundException({ message: "User not found" });
    }
    return this.authService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id') id: string): Promise<DeleteResult> {
    const user = await this.authService.getUserById(id);
    if (!user) {
      throw new NotFoundException({ message: "User not found" });
    }
    return this.authService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/session')
  getProfile(@Req() req):Promise<User> {
      return req.user;
  }
  
}
