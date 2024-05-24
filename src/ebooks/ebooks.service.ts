import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, ILike, In, Like, Repository } from 'typeorm';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { Wish } from './entities/wish.entity';
import { WishListDto } from './dto/wishlist';
import { AuthService } from '../auth/auth.service';
import { CreateEbookReaderDto } from './dto/create-ebookreader.dto';
import { validateUuid } from '../utils/validateUuid';
import { Vote } from './entities/vote.entity';

@Injectable()
export class EbooksService {
  private supabase;
  constructor(
    @InjectRepository(Ebook)
    private readonly ebooksRepository: Repository<Ebook>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(EbooksReader)
    private readonly ebookReaderRepository: Repository<EbooksReader>,
    @InjectRepository(Vote)
    private readonly votesRepository: Repository<Vote>,
    @Inject(forwardRef(() => AuthService))
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
      const userId = createEbookDto.authorId;
      validateUuid(userId);
      console.log(userId);

      const ebookExists = await this.findByIsbn(createEbookDto.isbn);

      if (ebookExists) {
        throw new Error('Ebook already exists');
      }

      const user = await this.authService.getUserById(userId);

      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return null;
      }

      const author = await this.authService.getAuthorByUser(user.id);

      if (!author) {
        console.error(`Author with ID ${userId} not found.`);
        return null;
      }

      const newEbook = this.ebooksRepository.create({
        ...createEbookDto,
        author: author
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

  public async findAll(page: number = 1, limit: number = 10): Promise<Ebook[]> {
    try {
      return await this.ebooksRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  public async findByIsbn(isbn: string): Promise<Ebook> {
    try {
      const ebook = await this.ebooksRepository.findOne({ where: { isbn } });
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
    const ebook = await this.findById(id);
    const result = await this.ebooksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ebook with ID ${id} not found.`);
    }
    return result;
  }

  public async assignEbookToReader(createEbookReaderDto: CreateEbookReaderDto): Promise<EbooksReader> {
    const newEbook = this.ebookReaderRepository.create({
      readerId: createEbookReaderDto.userId,
      ebookId: createEbookReaderDto.ebookId
    });

    await this.ebookReaderRepository.save(newEbook);
    return newEbook;
  }

  async findAllEbooksByReader(readerId: string, page: number = 1, limit: number = 10): Promise<Ebook[]> {
    try {
      validateUuid(readerId);
      const reader = await this.ebookReaderRepository.findOne({ where: { readerId: readerId } });
      if (!reader) {
        return [];
      }
      const ebooksReader = await this.ebookReaderRepository.find({
        where: { readerId: readerId }
      });

      const ebookIds = ebooksReader.map(er => er.ebookId);

      if (ebookIds.length > 0) {
        return this.ebooksRepository.find({
          where: { id: In(ebookIds) },
          skip: (page - 1) * limit,
          take: limit,
        });
      }

      return [];
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async addVote(userId: string, ebookId: string, value: number): Promise<Ebook> {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new BadRequestException('Invalid value');
    }
    const user = await this.authService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const ebook = await this.ebooksRepository.findOne({ where: { id: ebookId }, relations: ['votes'] });
    if (!ebook) {
      throw new NotFoundException('Ebook not found');
    }
  
    const ownership = await this.ebookReaderRepository.findOne({ where: { readerId: userId, ebookId: ebookId } });
    if (!ownership) {
      throw new ForbiddenException('You do not own this ebook');
    }
  
    let vote = await this.votesRepository.findOne({ where: { user: { id: userId }, ebook: { id: ebookId } } });
    if (vote) {
      vote.value = value;
    } else {
      vote = this.votesRepository.create({ value, ebook, user });
    }

    await this.votesRepository.save(vote);
  
    const votes = await this.votesRepository.find({ where: { ebook: { id: ebookId } } });
    ebook.rating = this.calculateRating(votes);
  
    return await this.ebooksRepository.save(ebook);
  }

  private calculateRating(votes: Vote[]): number {
    const total = votes.reduce((acc, vote) => acc + vote.value, 0);
    return total / votes.length;
  }

  public async findByCategory(category: string, page: number = 1, limit: number = 10): Promise<Ebook[]> {
    try {
      return await this.ebooksRepository.find({
        where: { category },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findByAuthor(authorId: string, page: number = 1, limit: number = 10): Promise<Ebook[]> {
    try {
      return await this.ebooksRepository.find({
        where: { author: { id: authorId } },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async searchByTitle(keyword: string, page: number = 1, limit: number = 10): Promise<Ebook[]> {
    try {
      return await this.ebooksRepository.find({
        where: { title: ILike(`%${keyword}%`) },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAllSorted(order: 'ASC' | 'DESC', page: number = 1, limit: number = 10): Promise<Ebook[]> {
    try {
      return await this.ebooksRepository.find({
        order: { rating: order },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
