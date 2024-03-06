import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: Query): Promise<Book[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  async create(
    book: CreateBookDto,
    userId: mongoose.Types.ObjectId,
  ): Promise<Book> {
    const data = Object.assign(book, { user: userId });

    const res = await this.bookModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Please enter correct Id.');
    }

    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async updateById(id: string, book: UpdateBookDto): Promise<Book> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Please enter correct Id.');
    }
    const Book = await this.bookModel.findById(id);

    if (!Book) {
      throw new NotFoundException('Book not found');
    }

    return this.bookModel.findByIdAndUpdate(id, book);
  }

  async deleteById(id: string) {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Please enter correct Id.');
    }
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return this.bookModel.findByIdAndDelete(id);
  }
}
