import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { CreateReaderDto, CreateAuthorDto, CreateUserDto, CreateAdminDto} from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

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

    @Post('signup/reader')
    public async signupReader(@Body() createReaderDto: CreateReaderDto): Promise<any> {
        console.log("Intentando registrarse");
    try {
        const userExists = await this.usersService.findReaderByUsername(createReaderDto.username);

        if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        createReaderDto.password = await bcrypt.hash(createReaderDto.password, 10);
        const user = await this.usersService.createReader(createReaderDto);

        const { password, ...result } = user;
        return result;

    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }
    @Post('signup/author')
    public async signupAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<any> {
        console.log("Intentando registrarse como autor");
        try {
          const userExists = await this.usersService.findAuthorByUsername(createAuthorDto.username);
    
          if (userExists) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
          }
    
          createAuthorDto.password = await bcrypt.hash(createAuthorDto.password, 10);
          // Aquí asumimos que existe un método `createAuthor` en `UsersService`
          const author = await this.usersService.createAuthor(createAuthorDto);
    
          const { password, ...result } = author;
          return result;
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      @Post('signup/admin')
    public async signupAdmin(@Body() createAdminDto: CreateAdminDto): Promise<any> {
        console.log("Intentando registrarse");
    try {
        const userExists = await this.usersService.findAdminByUsername(createAdminDto.username);

        if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        createAdminDto.password = await bcrypt.hash(createAdminDto.password, 10);
        const user = await this.usersService.createAdmin(createAdminDto);

        const { password, ...result } = user;
        return result;

    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

}
