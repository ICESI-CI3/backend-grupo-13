import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, MoreThan, Repository } from 'typeorm';
import { Ebook } from './entities/ebook.entity';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { Author, Reader } from 'src/auth/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { WishListDto } from './dto/wishlist';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class EbooksService {
  constructor(
    private authService: AuthService,
    @InjectRepository(Ebook)
    private readonly ebooksRepository: Repository<Ebook>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) { }

  public async addToWishlist(dto: WishListDto): Promise<Wish> {
    const user = await this.authService.getUserById(dto.reader);
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
  }

  public async removeFromWishlist(dto: WishListDto): Promise<DeleteResult> {
    const user = await this.authService.getUserById(dto.reader);
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
  }

  public async create(createEbookDto: CreateEbookDto): Promise<Ebook> {
    const user = await this.authService.getUserById(createEbookDto.author);
    const author = await this.authService.getAuthorByUser(user.id);

    if (!author) {
      throw new NotFoundException(`Author with ID ${createEbookDto.author} not found.`);
    }

    const binaryData: Uint8Array = Buffer.from(createEbookDto.fileData, 'base64');

    const newEbook = this.ebooksRepository.create({
      ...createEbookDto,
      author: author,
      fileData: binaryData,
    });

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
