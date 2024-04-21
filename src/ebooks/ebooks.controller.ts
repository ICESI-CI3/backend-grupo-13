import { Controller, Get, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, NotFoundException, Post} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { EbooksService } from './ebooks.service';
import { Ebook } from './entities/ebook.entity';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RoleEnum } from 'src/auth/enum/role.enum';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('ebooks')
export class EbooksController {
  constructor(private readonly ebooksService: EbooksService) {}

  @Roles(RoleEnum.AUTHOR)
  @Post()
  public async create(@Body() createEbookDto: CreateEbookDto): Promise<Ebook> {
    const ebookExists = await this.ebooksService.findByTitle(createEbookDto.title);

    if (ebookExists) {
    throw new HttpException('Ebook already exists', HttpStatus.BAD_REQUEST);
    }

    const ebook = await this.ebooksService.create(createEbookDto);
    return ebook;
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get()
  public async findAll(): Promise<Ebook[]> {
    try {
      const ebooks = this.ebooksService.findAll();
      return ebooks;        
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<Ebook> {
    const ebook = await this.ebooksService.findById(id);
    if (!ebook) {
      throw new NotFoundException({ message: "Ebook not found" });
    }
    return ebook;
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.ADMIN)
  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateEbookDto): Promise<Ebook> {
    const ebook = await this.ebooksService.findById(id);
    if (!ebook) {
      throw new NotFoundException({ message: "Ebook not found" });
    }
    return this.ebooksService.update(id, updateUserDto);
  }

  @Roles(RoleEnum.AUTHOR, RoleEnum.ADMIN)
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<DeleteResult> {
    const ebook = await this.ebooksService.findById(id);
    if (!ebook) {
      throw new NotFoundException({ message: "Ebook not found" });
    }
    return this.ebooksService.remove(id);
  }


  public async assignEbookToReader( userId:string, ebookId: string ){
    return this.ebooksService.assignEbookToReader(userId, ebookId);
  }

  @Get('/:readerId')
  getBooksByReader(@Param('readerId') readerId: string): Promise<Ebook[]> {
    return this.ebooksService.findAllEbooksByReader(readerId);
  }

}
