import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { SignUpDto } from '../src/auth/dto/signup.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import { Category } from '../src/book/schemas/book.schema';

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

  const book = {
    title: 'Book 225',
    description: 'Book 45 Description',
    author: 'Author 1',
    price: 50,
    category: Category.ADVENTURE,
  };

  const book2 = {
    title: 'Book 226',
    description: 'Book 46 Description',
    author: 'Author 2',
    price: 20,
    category: Category.FANTASY,
  };

  let bookId: string = '';

  let jwtToken: string = '';

  describe('Auth', () => {
    it('SignUp [POST]', async () => {
      const signUpBody: SignUpDto = {
        name: 'Houssassm',
        email: 'houssam72@gmail.com',
        password: 'tdwefefewfewe',
      };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpBody)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body).toHaveProperty('token');
          expect(res.body?.token.length).toBeGreaterThanOrEqual(10);
          jwtToken = res.body?.token;
        });
    });

    it('Login [GET]', async () => {
      const loginBody: LoginDto = {
        email: 'houssam72@gmail.com',
        password: 'tdwefefewfewe',
      };

      return request(app.getHttpServer())
        .get('/auth/login')
        .send(loginBody)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body).toHaveProperty('token');
          expect(res.body?.token.length).toBeGreaterThanOrEqual(10);
        });
    });
  });

  describe('Book', () => {
    it('createBook1 [POST]', async () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(book)
        .expect(201)
        .then((res) => {
          expect(res.body.title).toBeDefined();
          expect(res.body.title).toEqual(book.title);
          expect(res.body.description).toBeDefined();
          expect(res.body.description).toEqual(book.description);
          expect(res.body.author).toBeDefined();
          expect(res.body.author).toEqual(book.author);
          expect(res.body.price).toBeDefined();
          expect(res.body.price).toEqual(book.price);
          expect(res.body.category).toBeDefined();
          expect(res.body.category).toEqual(book.category);
        });
    });
    it('createBook2 [POST]', async () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(book2)
        .expect(201)
        .then((res) => {
          expect(res.body.title).toBeDefined();
          expect(res.body.title).toEqual(book2.title);
          expect(res.body.description).toBeDefined();
          expect(res.body.description).toEqual(book2.description);
          expect(res.body.author).toBeDefined();
          expect(res.body.author).toEqual(book2.author);
          expect(res.body.price).toBeDefined();
          expect(res.body.price).toEqual(book2.price);
          expect(res.body.category).toBeDefined();
          expect(res.body.category).toEqual(book2.category);
        });
    });
    it('getAllBooks [GET]', () => {
      return request(app.getHttpServer())
        .get('/book')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveLength(2);
          bookId = res.body[1]?._id;
        });
    });
    it('getBook [GET]', () => {
      return request(app.getHttpServer())
        .get(`/book/${bookId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.title).toBeDefined();
          expect(res.body.title).toEqual(book2.title);
          expect(res.body.description).toBeDefined();
          expect(res.body.description).toEqual(book2.description);
          expect(res.body.author).toBeDefined();
          expect(res.body.author).toEqual(book2.author);
          expect(res.body.price).toBeDefined();
          expect(res.body.price).toEqual(book2.price);
          expect(res.body.category).toBeDefined();
          expect(res.body.category).toEqual(book2.category);
        });
    });
    it('updateBook [PUT]', () => {
      return request(app.getHttpServer())
        .put(`/book/${bookId}`)
        .send({ price: 72 })
        .expect(200);
    });
    it('deleteBook [DELETE]', () => {
      return request(app.getHttpServer()).delete(`/book/${bookId}`).expect(200);
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });
});
