import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './Schema/book.schema';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<Book>,
  ) {}

  async findAll(pageNumber: number = 1, keyword: string = '') {
    const itemNumber = 2;
    const skipNumber = itemNumber * (pageNumber - 1);

    const items = await this.bookModel
      .find({ description: new RegExp('^.*' + keyword + '.*$', 'i') })
      .limit(itemNumber)
      .skip(skipNumber);

    const itemsLength = await this.bookModel
      .find({
        description: new RegExp('^.*' + keyword + '.*$', 'i'),
      })
      .countDocuments();

    return {
      length: itemsLength,
      items: items,
    };
  }
  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
  async createBook(createdBook: CreateBookDto): Promise<Book> {
    return new this.bookModel(createdBook).save();
  }

  async updateBook(id: string, updatedBook: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');

    await this.bookModel.findByIdAndUpdate(id, updatedBook);

    return this.findById(id);
  }

  async deleteBook(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');

    return this.bookModel.findByIdAndDelete(id);
  }
}
