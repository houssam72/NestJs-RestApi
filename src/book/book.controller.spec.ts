import { Test } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Category } from './schemas/book.schema';
import mongoose from 'mongoose';
import { PassportModule } from '@nestjs/passport';

describe('bookController', () => {
  let bookController: BookController;
  let bookService: BookService;

  const ObjectId = mongoose.Types.ObjectId;

  const mockBooks = {
    _id: new ObjectId('61c0ccf11d7bf83d153d7c06'),
    title: 'Book 225',
    description: 'Book 45 Description',
    author: 'Author 1',
    price: 50,
    category: Category.ADVENTURE,
    user: new ObjectId('65bf88b81a32d011f5c5031d'),
  };

  const mockBookService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compile();

    bookService = moduleRef.get<BookService>(BookService);
    bookController = moduleRef.get<BookController>(BookController);
  });

  describe('getAllBooks', () => {
    it('should get all books', async () => {
      const findAllService = jest
        .spyOn(bookService, 'findAll')
        .mockResolvedValue([mockBooks]);

      const response = await bookController.getAllBooks({
        page: '1',
      });

      expect(findAllService).toHaveBeenCalled();
      expect(response).toEqual([mockBooks]);
    });
  });

  describe('createBook', () => {
    it('should create book', async () => {
      const createBookService = jest
        .spyOn(bookService, 'create')
        .mockResolvedValue(mockBooks);

      const response = await bookController.createBook(mockBooks, {
        user: { _id: new ObjectId('65e99ef34b50cdf5f0c015a6') },
      });

      expect(createBookService).toHaveBeenCalled();
      expect(response).toEqual(mockBooks);
    });
  });

  describe('getBook', () => {
    it('should get book', async () => {
      const findByIdService = jest
        .spyOn(bookService, 'findById')
        .mockResolvedValue(mockBooks);

      const response = await bookController.getBook('65e99ef34b50cdf5f0c015a6');

      expect(findByIdService).toHaveBeenCalled();
      expect(response).toEqual(mockBooks);
    });
  });

  describe('updateBook', () => {
    it('should update book', async () => {
      const updateByIdService = jest
        .spyOn(bookService, 'updateById')
        .mockResolvedValue(mockBooks);

      const response = await bookController.updateBook(
        '65e99ef34b50cdf5f0c015a6',
        mockBooks,
      );

      expect(updateByIdService).toHaveBeenCalled();
      expect(response).toEqual(mockBooks);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const deleteByIdService = jest
        .spyOn(bookService, 'deleteById')
        .mockResolvedValue(mockBooks as any);

      const response = await bookController.deleteBook(
        '65e99ef34b50cdf5f0c015a6',
      );

      expect(deleteByIdService).toHaveBeenCalled();
      expect(response).toEqual(mockBooks);
    });
  });
});
