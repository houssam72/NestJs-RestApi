import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum Category {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Schema({
  timestamps: true,
})
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
