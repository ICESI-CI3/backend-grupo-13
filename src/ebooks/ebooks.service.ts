import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Ebook } from './entities/ebook.entity';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateEbookDto } from './dto/update-ebook.dto';

@Injectable()
export class EbooksService {
  constructor(
    @InjectRepository(Ebook)
    private readonly ebooksRepository: Repository<Ebook>,
    private readonly usersService: UsersService, 
  ) { }

  public async create(createEbookDto: CreateEbookDto): Promise<Ebook> {
    const author = await this.usersService.findAuthorById(createEbookDto.author);

    if (!author) {
      throw new NotFoundException(`User with ID ${author} not found.`);
    }

    const binaryData: Uint8Array = Buffer.from(createEbookDto.fileData)
    const newEbook = this.ebooksRepository.create({...createEbookDto, author: author, fileData: binaryData});
    await this.ebooksRepository.save(newEbook);
    return newEbook;
  }

  public async findAll(): Promise<Ebook[]> {
    return this.ebooksRepository.find();
  }

  public async findById(id: number): Promise<Ebook> {
    const ebook = await this.ebooksRepository.findOne({ where: { id } });
    if (!ebook) {
      throw new NotFoundException(`Ebook with ID ${id} not found.`);
    }
    return ebook;
  }

  public async findByTitle(title: string): Promise<Ebook> {
    try {
      const ebook = await this.ebooksRepository.findOne({ where: { title } });
      return ebook;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: number, updateEbookDto: UpdateEbookDto): Promise<Ebook> {
    const ebook = await this.findById(id);
    const updatedEbook = Object.assign(ebook, updateEbookDto);
    await this.ebooksRepository.save(updatedEbook);
    return updatedEbook;
  }

  public async remove(id: number): Promise<DeleteResult> {
    const result = await this.ebooksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ebook with ID ${id} not found.`);
    }
    return result;
  }
}
