import { Controller, Get, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { EbooksService } from './ebooks.service';
import { Ebook, EbooksReader } from './entities/ebook.entity';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { VisualizeEbookDto } from './dto/visualize-ebook.dto';
import { InfoEbookDto } from './dto/info-ebook.dto';
import { CreateEbookReaderDto } from './dto/create-ebookreader.dto';
import { VoteDto } from './dto/create-vote.dto';


@Controller('ebooks')
export class EbooksController {
  constructor(private readonly ebooksService: EbooksService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Post('/vote/:ebookId')
  async addVote(@Param('ebookId') ebookId: string, @Body() voteDto: VoteDto, @Req() req) {
    const userId = req.user.userId;
    return this.ebooksService.addVote(userId, ebookId, voteDto.value);
  }

  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  //@Roles(RoleEnum.AUTHOR)
  @Post()
  public async create(@Body() createEbookDto: CreateEbookDto): Promise<Ebook> {
    return await this.ebooksService.create(createEbookDto);
  }

  //@Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get()
  public async findAll(@Query('page') page: string, @Query('limit') limit: string,): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.ebooksService.findAll(pageNumber, limitNumber);
  }

  @Get('amount')
  public async getNumberBooks():Promise<number>{
    return this.ebooksService.getNumberBooks();
  }

  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  //@Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('info/:id')
  public async findById(@Param('id') id: string): Promise<InfoEbookDto> {
    const ebook = await this.ebooksService.findById(id);
    return new InfoEbookDto(ebook);
  }

  ////@Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('visualize/:id')
  public async visualizeById(@Param('id') id: string): Promise<VisualizeEbookDto> {
    const ebook = await this.ebooksService.findById(id);
    return new VisualizeEbookDto(ebook.title, Buffer.from(ebook.fileData).toString("base64"));
  }

  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  //@Roles(RoleEnum.AUTHOR, RoleEnum.ADMIN)
  @Patch('visualize/:id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateEbookDto): Promise<Ebook> {
    return this.ebooksService.update(id, updateUserDto);
  }

  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  //@Roles(RoleEnum.AUTHOR, RoleEnum.ADMIN)
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.ebooksService.remove(id);
  }

  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/ebookReader')
  public async assignEbookToReader(@Body() createEbookReaderDto: CreateEbookReaderDto): Promise<EbooksReader> {
    return this.ebooksService.assignEbookToReader(createEbookReaderDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/mybooks')
  public async getMyBooks(@Req() req, @Query('page') page: string, @Query('limit') limit: string,): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.ebooksService.findAllEbooksByReader(req.user.userId, pageNumber, limitNumber);
  }

  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  //@Roles(RoleEnum.ADMIN)
  @Get('/:readerId')
  public async getBooksByReader(@Param('readerId') readerId: string, @Query('page') page: string, @Query('limit') limit: string,): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.ebooksService.findAllEbooksByReader(readerId, pageNumber, limitNumber);
  }

  @Get('/check/:readerId/:bookId')
  public async readerHasThisBook(@Param('readerId') readerId: string,@Param('bookId') bookId: string): Promise<boolean> {

    return this.ebooksService.readerHasThisBook(readerId, bookId);
  }

  @Get('/category/:category')
  public async findByCategory(@Param('category') category: string, @Query('page') page: string, @Query('limit') limit: string): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.ebooksService.findByCategory(category, pageNumber, limitNumber);
  }

  @Get('category/amount/:category')
  public async getNumberByCategory(@Param('category') category: string): Promise<number> {
    return this.ebooksService.getNumberByCategory(category);
  }

  @Get('/author/:authorId')
  public async findByAuthor(@Param('authorId') authorId: string, @Query('page') page: string, @Query('limit') limit: string): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.ebooksService.findByAuthor(authorId, pageNumber, limitNumber);
  }

  @Get('/checkAuthor/:authorId/:ebookId')
  public async checkAuthorBooks(@Param('authorId') authorId: string,@Param('ebookId') ebookId: string): Promise<boolean> {
    return this.ebooksService.checkAuthorBooks(authorId, ebookId);
  }

  @Get('author/amount/:authorId')
  public async getNumberByAuthor(@Param('authorId') authorId: string): Promise<number> {
    return this.ebooksService.getNumberByAuthor(authorId);
  }

  @Get('/search/:keyword')
  public async searchByTitle(@Param('keyword') keyword: string, @Query('page') page: string, @Query('limit') limit: string): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.ebooksService.searchByTitle(keyword, pageNumber, limitNumber);
  }

  @Get('search/amount/:keyword')
  public async getNumberBySearch(@Param('keyword') keyword: string): Promise<number> {
    return this.ebooksService.getNumberBySearch(keyword);
  }

  @Get('/sorted/:order')
  public async findAllSorted(@Param('order') order: number, @Query('page') page: string, @Query('limit') limit: string): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 20;
    const sortOrder = order === 1 ? 'ASC' : 'DESC';
    return this.ebooksService.findAllSorted(sortOrder, pageNumber, limitNumber);
  }

  @Get('sorted/amount/:order')
  public async getNumberBySorted(@Param('order') order: number): Promise<number> {
    const sortOrder = order === 1 ? 'ASC' : 'DESC';
    return this.ebooksService.getNumberBySorted(sortOrder);
  }

}
