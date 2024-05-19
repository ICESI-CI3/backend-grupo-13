import { Controller, Post, Body, Get, UseGuards, Req, Param, Delete, Patch, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Author, Reader, User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './guard/roles.guard';
import { RoleEnum } from './enum/role.enum';
import { Roles } from './decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/session')
  getProfile(@Req() req):Promise<User> {
      return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/author/:id')
  getAuthorProfile(@Param('id') id: string):Promise<Author> {
    return this.authService.findAuthorById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/reader/:id')
  getReaderProfile(@Param('id') id: string):Promise<Reader> {
    return this.authService.findReaderById(id);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{ access_token: string }> {
    console.log(createUserDto)
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    console.log("Trying to login", loginUserDto.email, loginUserDto.password)
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/status')
  async checkAuthStatus(@Req() req): Promise<{ access_token: string }> {
      return this.authService.checkAuthStatus(req.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
      return this.authService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/')
  async getAllUsers(@Query('page') page: string,@Query('limit') limit: string, ): Promise<User[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.authService.getAllUsers(pageNumber, limitNumber);  
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.authService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.authService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('readers/:id')
  async getReaderById(@Param('id') id: string): Promise<Reader> {
    return this.authService.findReaderById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('authors/:id')
  async getAuthorById(@Param('id') id: string): Promise<Author> {
    return this.authService.findAuthorById(id);
  }
 
  
}
