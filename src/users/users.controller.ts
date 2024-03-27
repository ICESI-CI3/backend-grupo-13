import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus, NotFoundException} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import bcrypt from "bcrypt";
import { DeleteResult } from 'typeorm';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() userDto: CreateUserDto):Promise<any> {
    try {
      const userExists: User | null = await this.usersService.findByUsername(userDto.username);

      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      userDto.password = await bcrypt.hash(userDto.password, 10);
      const user: User = await this.usersService.create(userDto)

      const { password, ...result } = user;
      return result;

    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<User[]> {
    try {
      const users = this.usersService.findAll();
      return users;        
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException({ message: "User not found" });
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException({ message: "User not found" });
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<DeleteResult> {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException({ message: "User not found" });
    }
    return this.usersService.remove(+id);
  }
}
