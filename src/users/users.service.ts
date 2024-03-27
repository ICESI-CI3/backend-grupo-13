import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  public async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }  

  public async findByUsername(username: string): Promise<User>{
    try{
      const user = await this.usersRepository.findOne({where: {username}});
      return user;
    }catch(error){
      throw error;
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id); 
    const updatedUser = Object.assign(user, updateUserDto);
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  public async remove(id: number): Promise<DeleteResult> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return result;
  }
}
