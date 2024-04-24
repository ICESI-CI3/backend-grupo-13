import { Controller, Get } from '@nestjs/common';
import { SeederService } from './seed.service';

@Controller('seed')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Get()
  async seedData() {
    await this.seederService.seedData();
    return { message: 'Data seeded successfully' };
  }
}
