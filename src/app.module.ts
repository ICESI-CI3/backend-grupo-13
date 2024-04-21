import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EbooksModule } from './ebooks/ebooks.module';
import { SeedModule } from './seed/seed.module';
import { PaymentModule } from './payment/payment.module';



@Module({
  imports: [ 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({isGlobal: true,}), 
    AuthModule,
    EbooksModule,
    SeedModule,
    PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
