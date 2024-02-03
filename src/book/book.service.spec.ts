import { Test, TestingModule } from '@nestjs/testing';
import { Book, Category } from './schemas/book.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';

describe('Book Service', () => {
  let bookService: BookService;
  let model: Model<Book>;
  const mockBookServise = {
    findById: jest.fn(),
    find: jest.fn(),
  };

  const mockBook = {
    id: '61c0ccf11d7bf83d153d7c06',

    user: '61c0ccf11d7bf83d153d7c06',

    title: 'New Book',
    description: 'Book Description',

    author: 'Author',

    price: 100,

    category: Category.FANTASY,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookServise,
        },
      ],
    }).compile();
    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findAll', () => {
    it('Should return an Array of book', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue(mockBook),
            }),
          }) as any,
      );

      const result = await bookService.findAll(query);

      expect(result).toEqual(mockBook);
    });
  });

  describe('findById', () => {
    it('Should find and return a book by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

      const result = await bookService.findById(mockBook.id);

      expect(model.findById).toHaveBeenCalledWith(mockBook.id);
      expect(result).toEqual(mockBook);
    });

    it('Should return a BadRequestException when we enter an incorrect Id', async () => {
      const id = 'invalid_id';

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );
    });
    // Or we can do that
    it('Should return a BadRequestException when we enter an incorrect Id', async () => {
      const id = 'invalid_id';

      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Should return a NotFoundException', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(bookService.findById(mockBook.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith(mockBook.id);
    });
  });
});
