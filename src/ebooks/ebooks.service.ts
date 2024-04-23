import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, In, Repository } from 'typeorm';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { Wish } from './entities/wish.entity';
import { WishListDto } from './dto/wishlist';
import { AuthService } from 'src/auth/auth.service';
import { CreateEbookReaderDto } from './dto/create-ebookreader.dto';
import { validateUuid } from 'src/utils/validateUuid';

@Injectable()
export class EbooksService {
  constructor(
    @InjectRepository(Ebook)
    private readonly ebooksRepository: Repository<Ebook>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(EbooksReader)
    private readonly ebookReaderRepository: Repository<EbooksReader>,
    @InjectRepository(EbooksReader)
    private ebooksReaderRepository: Repository<EbooksReader>,
    private readonly authService: AuthService
  ) { }

  public async addToWishlist(dto: WishListDto): Promise<Wish> {
    try {
        validateUuid(dto.reader);
        validateUuid(dto.ebook);

        const user = await this.authService.getUserById(dto.reader);
        if (!user) {
            throw new NotFoundException(`User not found.`);
        }

        const reader = await this.authService.getReaderByUser(user.id);
        if (!reader) {
            throw new NotFoundException(`Reader not found.`);
        }

        const ebook = await this.ebooksRepository.findOne({ where: { id: dto.ebook } });
        if (!ebook) {
            throw new NotFoundException(`Ebook not found.`);
        }

        const newWish = this.wishRepository.create({
            reader,
            ebook
        });
        await this.wishRepository.save(newWish);
        return newWish;
    } catch (error) {
        console.error(`Error adding to wishlist: ${error.message}`);
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, HttpStatus.BAD_REQUEST);
    }
}
public async removeFromWishlist(dto: WishListDto): Promise<DeleteResult> {
  try {
      validateUuid(dto.reader);
      validateUuid(dto.ebook);

      const user = await this.authService.getUserById(dto.reader);
      if (!user) {
          throw new NotFoundException(`User not found.`);
      }

      const reader = await this.authService.getReaderByUser(user.id);
      if (!reader) {
          throw new NotFoundException(`Reader not found.`);
      }

      const ebook = await this.ebooksRepository.findOne({ where: { id: dto.ebook } });
      if (!ebook) {
          throw new NotFoundException(`Ebook not found.`);
      }

      const result = await this.wishRepository.delete({ reader, ebook });
      if (result.affected === 0) {
          throw new NotFoundException(`No changes`);
      }
      return result;
  } catch (error) {
      console.error(`Error removing from wishlist: ${error.message}`); 
      throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
      }, HttpStatus.BAD_REQUEST);
  }
}

  public async create(createEbookDto: CreateEbookDto): Promise<Ebook> {
    try {
        validateUuid(createEbookDto.author);

        const user = await this.authService.getUserById(createEbookDto.author);
        
        if (!user) {
            console.error(`User with ID ${createEbookDto.author} not found.`);
            return null; 
        }

        const author = await this.authService.getAuthorByUser(user.id);
        
        if (!author) {
            console.error(`Author with ID ${createEbookDto.author} not found.`);
            return null; 
        }

        const binaryData: Uint8Array = Buffer.from(createEbookDto.fileData, 'base64');
        const newEbook = this.ebooksRepository.create({
            ...createEbookDto,
            author: author,
            fileData: binaryData,
        });

        await this.ebooksRepository.save(newEbook);
        return newEbook;
    } catch (error) {
        console.error(`Error creating eBook: ${error.message}`); 
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
}



  public async findAll(): Promise<Ebook[]> {
    return this.ebooksRepository.find();
  }

  public async findById(id: string): Promise<Ebook> {
    try {
        
        validateUuid(id);

        const ebook = await this.ebooksRepository.findOne({ where: { id } });
        if (!ebook) {
            throw new NotFoundException(`Ebook with ID ${id} not found.`);
        }
        return ebook;
    } catch (error) {
        console.error(`Error finding eBook by ID: ${error.message}`);
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: `Error finding eBook: ${error.message}`,
        }, HttpStatus.BAD_REQUEST);
    }
}

  public async filterBy(filter: { price: number[], author: string, }): Promise<Ebook[]> {
    const query = {};

    if (filter.price) {
      query['price'] = Between(filter.price[0], filter.price[1]);
    }

    if (filter.author) {
      query['author'] = filter.author;
    }

    const ebooks = await this.ebooksRepository.findBy(
      query
    );

    if (ebooks.length == 0) {
      throw new NotFoundException(`No ebook matches that filter`);
    }
    return ebooks;
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

  public async assignEbookToReader(createEbookReaderDto: CreateEbookReaderDto):Promise<EbooksReader> {

    const newEbook = this.ebookReaderRepository.create({
      readerId:createEbookReaderDto.userId,
      ebookId:createEbookReaderDto.ebookId
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

  async addEbooksToReader(userId: string, ebooks: Ebook[]): Promise<void> {
    for (const ebook of ebooks) {
      const existingAssignment = await this.ebookReaderRepository.findOne({
        where: {
          readerId: userId,
          ebookId: ebook.id,
        },
      });

      if (!existingAssignment) {
        const tem = new CreateEbookReaderDto();
        tem.ebookId = ebook.id;
        tem.userId = userId;
        await this.assignEbookToReader(tem);  
      } 
    }
  }
  
  
  async findBy(ids: string[]): Promise<Ebook[]> {
    return await this.ebooksRepository.find({
      where: { id: In(ids) }
    });
  }
}
