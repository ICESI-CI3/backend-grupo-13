import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Author, Reader, User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException } from '@nestjs/common';
import { RoleEnum } from './enum/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateUuid } from '../utils/validateUuid';
import { throwError } from 'rxjs';


@Injectable()
export class AuthService {
  
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reader)
    private readonly readerRepository: Repository<Reader>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) { }


  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async createUser(createUserDto: CreateUserDto): Promise<{ access_token: string }> {
    try {

      const { password, email, role, ...userData } = createUserDto;

      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      let rol = await this.getRole(role);

      if(rol==RoleEnum.USER){
        if(createUserDto.favoriteGenre == null || createUserDto.bookList == null){
          throw new Error('Missing attributes for a reader');
        }
      }else if(rol==RoleEnum.AUTHOR){
        if(createUserDto.penName == null || createUserDto.biography == null || createUserDto.booksWritten == null){
          throw new Error('Missing attributes for a author');
        }
      }

      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
        role: rol
      });
      const savedUser = await this.userRepository.save(user);

      console.log("Role: ", role, " ID Usuario: ", savedUser.id)
      await this.addRoleSpecific(role, savedUser.id, createUserDto);

      const payload = { username: savedUser.username, sub: savedUser.id, role: savedUser.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async addRoleSpecific(roleName: string, userId: string, createUserDto: CreateUserDto) {
    switch (roleName) {
      case 'Reader':
        console.log("Creando lector");
        const reader = this.readerRepository.create({
          userId: userId,
          favoriteGenre: createUserDto.favoriteGenre,
          bookList: createUserDto.bookList,
        });
        await this.readerRepository.save(reader);
        break;
      case 'Author':
        console.log("Creando autor");
        const author = this.authorRepository.create({
          userId: userId,
          penName: createUserDto.penName,
          biography: createUserDto.biography,
          booksWritten: createUserDto.booksWritten,
        });
        await this.authorRepository.save(author);
        break;
    }
  }

  async checkAuthStatus(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async getUserById(id: string): Promise<User | undefined> {
    try {
        validateUuid(id);

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            console.error(`User with ID ${id} not found.`);
        }
        return user;
    } catch (error) {
        throw new NotFoundException(`Error finding user: ${error.message}`);
    }
  }

  async getReaderByUser(userId: string) {
    try{
      validateUuid(userId);
      return this.readerRepository.findOne({ where: { userId } });
    }catch(error){
      throw new NotFoundException(`Error finding user: ${error.message}`);
    }
    
  } 

  async getAuthorByUser(userId: string) {
    try{
      validateUuid(userId);
      return this.authorRepository.findOne({ where: { userId } });
    }catch(error){
      throw new NotFoundException(`Error finding user: ${error.message}`);
    }
  } 

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByIdAndRole(id: string, roleName: string): Promise<User | undefined> {
    try{
      validateUuid(id);
      let rol = await this.getRole(roleName);
      return this.userRepository.findOne({ where: { id, role: rol } });
    } catch(error){
      throw new NotFoundException(`Error finding user: ${error.message}`);
    }

  }

  public async findByUsername(username: string): Promise<User>{
    try{
      const user = await this.userRepository.findOne({where: {username}});
      return user;
    }catch(error){
      throw error;
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.getUserById(id); 
      const updatedUser = Object.assign(user, updateUserDto);
      await this.userRepository.save(updatedUser);
      return updatedUser;
    } catch (error) {
        throw new NotFoundException(`Error finding user: ${error.message}`);
    }
  }

  public async remove(id: string): Promise<DeleteResult> {
    try {
      const user = await this.getUserById(id); 
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return result;
    } catch (error) {
        throw new NotFoundException(`Error finding user: ${error.message}`);
    }
  }

  public async getRole(roleName:string):Promise<RoleEnum>{
    switch (roleName) {
      case 'Reader':
        return RoleEnum.USER
      case 'Author':
        return RoleEnum.AUTHOR
      case 'Admin':
        return RoleEnum.ADMIN
      default:
          throw new Error('Not a valid role');
    }
  }
}
