import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './Schema/book.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  findAll(@Query('page') page: number, @Query('keyword') keyword: string) {
    return this.bookService.findAll(page, keyword);
  }

  @Get(':id')
  findBook(@Param('id') id: string): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  createBook(@Body() book: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(book);
  }

  @Put(':id')
  updateBook(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(id, book);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string): Promise<Book> {
    return this.bookService.deleteBook(id);
  }
}
