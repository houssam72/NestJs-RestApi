import { Category } from '../schemas/book.schema';
import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from "mongoose";

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category' })
  readonly category: Category;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: mongoose.Types.ObjectId;
}
