import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Author is required' })
  @IsString({ message: 'Author must be a string' })
  author: string;

  @IsOptional()
  @IsString({ message: 'Genre must be a string' })
  genre?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Published year must be an integer' })
  @Min(0, { message: 'Published year cannot be negative' })
  @Max(new Date().getFullYear(), {
    message: 'Published year cannot be in the future',
  })
  publishedYear?: number;
}
