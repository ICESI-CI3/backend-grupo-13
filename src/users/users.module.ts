import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Author, Admin, Reader } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Author, Admin, Reader])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
