import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateReaderDto, CreateAuthorDto, CreateAdminDto } from './dto/create-user.dto';
import { UpdateReaderDto, UpdateAuthorDto,UpdateAdminDto } from './dto/update-user.dto';
import { User, Author, Admin, Reader } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Reader)
    private readonly readersRepository: Repository<Reader>,
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async createReader(createReaderDto: CreateReaderDto): Promise<Reader> {
    const newReader = this.readersRepository.create(createReaderDto);
    await this.readersRepository.save(newReader);
    await this.userRepository.save(newReader);
    return newReader;
  }
  public async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const newAuthor = this.authorsRepository.create(createAuthorDto);
    await this.authorsRepository.save(newAuthor);
    await this.userRepository.save(newAuthor);
    return newAuthor;
  }
  public async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const newAdmin = this.adminsRepository.create(createAdminDto);
    await this.adminsRepository.save(newAdmin);
    await this.userRepository.save(newAdmin);
    return newAdmin;
  }
  public async findAllReaders(): Promise<Reader[]> {
    return this.readersRepository.find();
  }

  public async findAllAuthors(): Promise<Author[]> {
      return this.authorsRepository.find();
  }

  public async findAllAdmins(): Promise<Admin[]> {
      return this.adminsRepository.find();
  }

  public async findReaderById(id: number): Promise<Reader> {
      const reader = await this.readersRepository.findOneBy({ id });
      if (!reader) {
        throw new NotFoundException(`Reader with ID ${id} not found.`);
      }
      return reader;
  }

  public async findAuthorById(id: number): Promise<Author> {
      const author = await this.authorsRepository.findOneBy({ id });
      if (!author) {
        throw new NotFoundException(`Author with ID ${id} not found.`);
      }
      return author;
  }

  public async findAdminById(id: number): Promise<Admin> {
      const admin = await this.adminsRepository.findOneBy({ id });
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found.`);
      }
      return admin;
  }


  public async findReaderByUsername(username: string): Promise<Reader> {
    return this.readersRepository.findOneBy({ username });
  }

  public async findAuthorByUsername(username: string): Promise<Author> {
      return this.authorsRepository.findOneBy({ username });
  }

  public async findAdminByUsername(username: string): Promise<Admin> {
      return this.adminsRepository.findOneBy({ username });
  }

  public async updateReader(id: number, updateReaderDto: UpdateReaderDto): Promise<Reader> {
      const reader = await this.findReaderById(id);
      const updatedReader = Object.assign(reader, updateReaderDto);
      await this.readersRepository.save(updatedReader);
      return updatedReader;
  }

  public async updateAuthor(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
      const author = await this.findAuthorById(id);
      const updatedAuthor = Object.assign(author, updateAuthorDto);
      await this.authorsRepository.save(updatedAuthor);
      return updatedAuthor;
  }

  public async updateAdmin(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
      const admin = await this.findAdminById(id);
      const updatedAdmin = Object.assign(admin, updateAdminDto);
      await this.adminsRepository.save(updatedAdmin);
      return updatedAdmin;
  }


  public async removeReader(id: number): Promise<DeleteResult> {
      return this.readersRepository.delete(id);
  }

  public async removeAuthor(id: number): Promise<DeleteResult> {
      return this.authorsRepository.delete(id);
  }

  public async removeAdmin(id: number): Promise<DeleteResult> {
      return this.adminsRepository.delete(id);
  }

}
