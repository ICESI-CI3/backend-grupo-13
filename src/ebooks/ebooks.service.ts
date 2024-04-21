import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, In, Repository } from 'typeorm';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { AuthService } from 'src/auth/auth.service';
import { Author } from 'src/auth/entities/user.entity';

@Injectable()
export class EbooksService {
  constructor(
    @InjectRepository(Ebook)
    private readonly ebooksRepository: Repository<Ebook>,
    private readonly ebookReaderRepository: Repository<EbooksReader>,
    private readonly authService: AuthService
  ) { }

  public async create(createEbookDto: CreateEbookDto): Promise<Ebook> {
    const author = await this.authService.getUserByIdAndRole(createEbookDto.author.userId, 'Author');

    if (!author) {
      throw new NotFoundException(`Author with ID ${createEbookDto.author} not found.`);
    }

    const binaryData: Uint8Array = Buffer.from(createEbookDto.fileData, 'base64');
    const ebookAuthor: DeepPartial<Author> = {
      id: author.id, 
      
    };
    
    const newEbook = this.ebooksRepository.create({
      ...createEbookDto,
      author: ebookAuthor,
      fileData: binaryData,
    });

    await this.ebooksRepository.save(newEbook);
    return newEbook;
}


  public async findAll(): Promise<Ebook[]> {
    return this.ebooksRepository.find();
  }

  public async findById(id: string): Promise<Ebook> {
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

  public async update(id: string, updateEbookDto: UpdateEbookDto): Promise<Ebook> {
    const ebook = await this.findById(id);
    const updatedEbook = Object.assign(ebook, updateEbookDto);
    await this.ebooksRepository.save(updatedEbook);
    return updatedEbook;
  }

  public async remove(id: string): Promise<DeleteResult> {
    const result = await this.ebooksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ebook with ID ${id} not found.`);
    }
    return result;
  }

  public async assignEbookToReader(readerId: string, ebookId: string) {

    const newEbook = this.ebookReaderRepository.create({
      readerId,
      ebookId
    });

    await this.ebookReaderRepository.save(newEbook);
    return newEbook;
  }

  async findAllEbooksByReader(readerId: string): Promise<Ebook[]> {
    
    const ebooksReader = await this.ebookReaderRepository.find({
      where: { readerId: readerId }
    });

    const ebookIds = ebooksReader.map(er => er.ebookId);

    if (ebookIds.length > 0) {
      return this.ebooksRepository.findBy({ id: In(ebookIds) });
    }

    return [];
  }

}
