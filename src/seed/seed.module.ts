import { Module } from '@nestjs/common';
// import { SeedService } from './seed.service';
// import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [/*SeedController*/],
  // providers: [SeedService],z
  imports: [AuthModule]
})
export class SeedModule {}
