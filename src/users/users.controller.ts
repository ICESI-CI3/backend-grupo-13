import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateReaderDto, UpdateAuthorDto, UpdateAdminDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Reader, Author, Admin } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('readers')
  @Roles('admin')
  public async findAllReaders(): Promise<Reader[]> {
    return this.usersService.findAllReaders();
  }

  @Get('readers/:id')
  public async findReaderById(@Param('id') id: string): Promise<Reader> {
    return this.usersService.findReaderById(+id);
  }

  @Patch('readers/:id')
  public async updateReader(@Param('id') id: string, @Body() updateReaderDto: UpdateReaderDto): Promise<Reader> {
    return this.usersService.updateReader(+id, updateReaderDto);
  }

  @Delete('readers/:id')
  public async removeReader(@Param('id') id: string): Promise<void> {
    await this.usersService.removeReader(+id);
  }


  @Get('authors')
  public async findAllAuthors(): Promise<Author[]> {
    return this.usersService.findAllAuthors();
  }

  @Get('authors/:id')
  public async findAuthorById(@Param('id') id: string): Promise<Author> {
    return this.usersService.findAuthorById(+id);
  }

  @Patch('authors/:id')
  public async updateAuthor(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    return this.usersService.updateAuthor(+id, updateAuthorDto);
  }

  @Delete('authors/:id')
  public async removeAuthor(@Param('id') id: string): Promise<void> {
    await this.usersService.removeAuthor(+id);
  }


  @Get('admins')
  public async findAllAdmins(): Promise<Admin[]> {
    return this.usersService.findAllAdmins();
  }

  @Get('admins/:id')
  public async findAdminById(@Param('id') id: string): Promise<Admin> {
    return this.usersService.findAdminById(+id);
  }

  @Patch('admins/:id')
  public async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<Admin> {
    return this.usersService.updateAdmin(+id, updateAdminDto);
  }

  @Delete('admins/:id')
  public async removeAdmin(@Param('id') id: string): Promise<void> {
    await this.usersService.removeAdmin(+id);
  }
}

