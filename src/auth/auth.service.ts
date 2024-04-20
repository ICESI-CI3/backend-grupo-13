import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Author, Reader, Role, User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async validateUser(username: string, pass: string, roles: string[]): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && bcrypt.compareSync(pass, user.password) && roles.includes(user.role)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

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
    
    const { password, roleId, ...userData } = createUserDto;

    const role = await this.roleRepository.findOne(roleId);
    if (!role) {
      throw new Error('El rol proporcionado no es válido.');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: role
    });
    const savedUser = await this.userRepository.save(user);

    await this.addRoleSpecific(role.name, savedUser.id, createUserDto);

    const payload = { username: savedUser.username, sub: savedUser.id, role: savedUser.role.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async addRoleSpecific(roleName: string, userId: number, createUserDto: CreateUserDto) {
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
      case 'Admin':
        const admin = this.adminRepository.create({
          userId: userId,
          accessLevel: createUserDto.accessLevel,
        });
        await this.adminRepository.save(admin);
        break;
      // Considera añadir una cláusula de manejo de errores si el rol es desconocido
    }
  }

  async checkAuthStatus(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
  

async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
}
async getUserByIdAndRole(id: number, role: string): Promise<User | undefined> {
  return this.userRepository.findOne({ where: { id, role } });
}

}
