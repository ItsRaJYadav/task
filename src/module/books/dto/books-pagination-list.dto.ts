import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';

export class BooksPaginationFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  genre?: string;
}
