import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    const db = await mongoose.connect(process.env.DB_URI);
    await db.connection.db.dropDatabase();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/book').expect(200).expect([]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });
});
