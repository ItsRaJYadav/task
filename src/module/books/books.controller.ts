import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksPaginationFilterDto } from './dto/books-pagination-list.dto';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @Public()
  findAll(@Query() filterDto: BooksPaginationFilterDto) {
    return this.booksService.findAll(filterDto);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() filterDto: PaginationDto,
  ) {
    return this.booksService.findOne(id, filterDto.page, filterDto.limit);
  }

  @Get('search/author-title')
  @Public()
  searchBooks(@Query() searchDto: SearchBooksDto) {
    const { query } = searchDto;
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }
    return this.booksService.searchBooks(query);
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  postReview(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.booksService.postReview(req, id, createReviewDto);
  }
}
