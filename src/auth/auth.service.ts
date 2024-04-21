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
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { UpdateUserDto } from './dto/update-user.dto';


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

      const { password, role, ...userData } = createUserDto;


      const hashedPassword = bcrypt.hashSync(password, 10);

      let rol;
      switch (role) {
        case 'Reader':
          rol = RoleEnum.USER
          break;
        case 'Author':
          rol = RoleEnum.AUTHOR
          break;
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
  async getUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getReaderByUser(userId: string) {
    return this.readerRepository.findOne({ where: { userId } });
  } 

  async getAuthorByUser(userId: string) {
    return this.authorRepository.findOne({ where: { userId } });
  } 

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByIdAndRole(id: string, roleName: string): Promise<User | undefined> {
    let rol;
    switch (roleName) {
      case 'Reader':
        rol = RoleEnum.USER
        break;
      case 'Author':
        rol = RoleEnum.AUTHOR
        break;
      case 'Admin':
        rol = RoleEnum.ADMIN
      break;
    }
    return this.userRepository.findOne({ where: { id, role: rol } });
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
    const user = await this.getUserById(id); 
    const updatedUser = Object.assign(user, updateUserDto);
    await this.userRepository.save(updatedUser);
    return updatedUser;
  }

  public async remove(id: string): Promise<DeleteResult> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return result;
  }
}