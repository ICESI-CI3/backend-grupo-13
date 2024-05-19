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
      console.log("opo")
      const { password, email, role, ...userData } = createUserDto;

      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      let rol = await this.getRole(role);

      console.log("aaaa")

      if(rol==RoleEnum.USER){
        if(createUserDto.favoriteGenre == null){
          throw new Error('Missing attributes for a reader');
        }
      }else if(rol==RoleEnum.AUTHOR){
        if(createUserDto.penName == null || createUserDto.biography == null){
          throw new Error('Missing attributes for a author');
        }
      }


      const user = await this.userRepository.create({
        ...userData, 
        password: hashedPassword,
        email: email,
        role: rol
      });
      const savedUser = await this.userRepository.save(user);

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
        const reader = this.readerRepository.create({
          userId: userId,
          favoriteGenre: createUserDto.favoriteGenre,
          bookList: createUserDto.bookList,
        });
        await this.readerRepository.save(reader);
        break;
      case 'Author':
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
            throw new Error(`User with ID ${id} not found.`);
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

  async getAllUsers(page: number = 1, limit: number = 10): Promise<User[]> {
    return this.userRepository.find({skip: (page - 1) * limit, take: limit,});
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
  public async findById(id: string): Promise<User>{
    try{
      const user = await this.userRepository.findOne({where: {id}});
      return user;
    }catch(error){
      throw error;
    }
  }
  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = Object.assign(user, updateUserDto);
      await this.userRepository.save(updatedUser);

      if (updatedUser.role === 'Reader') {
        const reader = await this.readerRepository.findOne({ where: { userId: id } });
        if (reader) {
          Object.assign(reader, updateUserDto);
          await this.readerRepository.save(reader);
        }
      } else if (updatedUser.role === 'Author') {
        const author = await this.authorRepository.findOne({ where: { userId: id } });
        if (author) {
          Object.assign(author, updateUserDto);
          await this.authorRepository.save(author);
        }
      }

      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`Error updating user: ${error.message}`);
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
  async findReaderById(userId: string): Promise<any> {
    const reader = await this.readerRepository.findOne({ where: { userId } });
    if (!reader) {
      throw new NotFoundException('Reader not found');
    }
    const id = userId
    const user = await this.userRepository.findOne({ where: { id } });
    return {user,reader};
  }

  async findAuthorById(userId: string): Promise<any> {
    const author = await this.authorRepository.findOne({ where: { userId } });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    const id = userId
    const user = await this.userRepository.findOne({ where: { id } });
    return {user,author};
  }
}
