import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsNumber()
  bookId: number;
}
