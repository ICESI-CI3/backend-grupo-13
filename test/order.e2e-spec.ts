import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Order Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Autenticar y obtener el token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'validUser',
        password: 'validPassword'
      });

    authToken = response.body.accessToken; 
  });

  afterAll(async () => {
    await app.close();
  });
  it('/order/create (POST)', () => {
    return request(app.getHttpServer())
      .post('/order/create')
      .send({ userId: 'a96ccdfc-8ace-4e22-8526-eafdbe938434', productIds: ['a96ccdfc-8ace-4e22-8526-eafdbe938439', 'a96ccdfc-8ace-4e22-8526-eafdbe9384392'] })
      .expect(201)
      .expect({ status: 'order created', orderId: expect.any(String) });
  });

  it('/order/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/order/some-order-id')
      .expect(200)
      .expect({
        orderId: 'some-order-id',
        userId: 'some-user-id',
        products: expect.any(Array),
      });
  });

  // Más pruebas para actualizar y eliminar órdenes...
});
