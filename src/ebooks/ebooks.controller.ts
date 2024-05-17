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

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('ebooks')
export class EbooksController {
  constructor(private readonly ebooksService: EbooksService) { }

  @Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Post('/vote/:ebookId')
  async addVote(@Param('ebookId') ebookId: string, @Body() voteDto: VoteDto, @Req() req) {
    const userId = req.user.userId; 
    return this.ebooksService.addVote(userId, ebookId, voteDto.value);
  }

  @Roles(RoleEnum.AUTHOR)
  @Post()
  public async create(@Body() createEbookDto: CreateEbookDto,@Req() req): Promise<Ebook> {
    return await this.ebooksService.create(createEbookDto,req.user.userId);
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get()
  public async findAll(@Query('page') page: string,  @Query('limit') limit: string,): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.ebooksService.findAll(pageNumber, limitNumber);
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('info/:id')
  public async findById(@Param('id') id: string): Promise<InfoEbookDto> {
    const ebook = await this.ebooksService.findById(id);
    return new InfoEbookDto(ebook.title, ebook.publisher, ebook.author.penName, ebook.overview, ebook.price, ebook.stock);
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('visualize/:id')
  public async visualizeById(@Param('id') id: string): Promise<VisualizeEbookDto> {
    const ebook = await this.ebooksService.findById(id);
    return new VisualizeEbookDto(ebook.title, Buffer.from(ebook.fileData).toString("base64"));
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.ADMIN)
  @Patch('visualize/:id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateEbookDto): Promise<Ebook> {
    return this.ebooksService.update(id, updateUserDto);
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.ADMIN)
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.ebooksService.remove(id);
  }

  @Post('/ebookReader')
  public async assignEbookToReader(@Body() createEbookReaderDto: CreateEbookReaderDto):Promise<EbooksReader>{
    return this.ebooksService.assignEbookToReader(createEbookReaderDto);
  }

  
  @Get('/mybooks')
  public async getMyBooks(@Req() req, @Query('page') page: string,  @Query('limit') limit: string,): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.ebooksService.findAllEbooksByReader(req.user.userId, pageNumber, limitNumber);
  }



  @Roles(RoleEnum.ADMIN)
  @Get('/:readerId')
  public async getBooksByReader(@Param('readerId') readerId: string,@Query('page') page: string,  @Query('limit') limit: string,): Promise<Ebook[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.ebooksService.findAllEbooksByReader(readerId, pageNumber, limitNumber);
  }



}
