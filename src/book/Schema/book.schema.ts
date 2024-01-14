import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type bookDocument = HydratedDocument<Book>;

export enum Category {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  category: Category;
}

export const BookSchema = SchemaFactory.createForClass(Book);
