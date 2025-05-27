import { IsOptional, IsString } from 'class-validator';

export class SearchBooksDto {
  @IsOptional()
  @IsString()
  query?: string;
}
