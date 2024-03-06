import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book, Category } from './schemas/book.schema';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  const ObjectId = mongoose.Types.ObjectId;

  const mockBook = {
    _id: '61c0ccf11d7bf83d153d7c06',
    user: new ObjectId('65bf88d71a32d011f5c50320'),
    title: 'New Book',
    description: 'Book Description',
    author: 'Author',
    price: 100,
    category: Category.FANTASY,
  };

  const mockBookService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockBook]),
            }),
          }) as any,
      );

      const result = await bookService.findAll(query);

      expect(model.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
      });

      expect(result).toEqual([mockBook]);
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const Book: CreateBookDto = {
        title: 'Book 46',
        description: 'zianu SMARI book lali 45 Description',
        author: 'Author 1',
        price: 50,
        category: Category.ADVENTURE,
        user: new ObjectId('65bf88d71a32d011f5c50320'),
      };

      const data = [];
      data.push(Book);

      const createModel = jest.spyOn(model, 'create').mockResolvedValue(data);

      const result = await bookService.create(
        Book,
        new ObjectId('65bf88d71a32d011f5c50320'),
      );

      expect(createModel).toHaveBeenCalled();
      expect(result[0]).toEqual(Book);
    });
  });

  describe('findById', () => {
    it('should find and return a book by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

      const result = await bookService.findById(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(bookService.findById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });

  describe('updateById', () => {
    it('Should update a book', async () => {
      const id = 'valid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(true);

      const findByIdmodel = jest
        .spyOn(model, 'findById')
        .mockResolvedValue(mockBook);

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValue({ ...mockBook, title: 'Book 46' });

      const result = await bookService.updateById(id, {
        ...mockBook,
        title: 'Book 46',
      });

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      expect(findByIdmodel).toHaveBeenCalledWith(id);

      expect(result).toEqual({ ...mockBook, title: 'Book 46' });
      isValidObjectIDMock.mockRestore();
    });

    it('Should return a bad request exception', async () => {
      const id = 'invalid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('Should return a NotFoundException', async () => {
      const id = 'valid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(true);

      const findByIdmodel = jest
        .spyOn(model, 'findById')
        .mockResolvedValue(undefined);

      await expect(bookService.findById(id)).rejects.toThrow(NotFoundException);

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      expect(findByIdmodel).toHaveBeenCalledWith(id);

      isValidObjectIDMock.mockRestore();
      findByIdmodel.mockRestore();
    });
  });

  describe('deleteById', () => {
    it('Should delete a book', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      await expect(bookService.deleteById('Valid_id')).resolves.toEqual(
        mockBook,
      );
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      await expect(bookService.deleteById('Invalid_id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(bookService.deleteById('Valid_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
