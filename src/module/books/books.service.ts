import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksPaginationFilterDto } from './dto/books-pagination-list.dto';
import { UserService } from '../user/user.service';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { Review } from '../reviews/entities/review.entity';
import { Request } from 'express';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly userService: UserService,
    private readonly reviewService: ReviewsService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { title, author } = createBookDto;

    const existingBook = await this.bookRepository.findOne({
      where: { title, author },
    });

    if (existingBook) {
      throw new ConflictException(
        'Book with this title and author already exists',
      );
    }

    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(
    filterDto: BooksPaginationFilterDto,
  ): Promise<{ books: Book[]; total: number }> {
    const { page = 1, limit = 10, author, genre } = filterDto;

    const query = this.bookRepository.createQueryBuilder('book');

    if (author) {
      query.andWhere('book.author ILIKE :author', { author: `%${author}%` });
    }

    if (genre) {
      query.andWhere('book.genre ILIKE :genre', { genre: `%${genre}%` });
    }

    const [books, total] = await query
      .orderBy('book.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      total,
      books,
    };
  }

  async searchBooks(queryString: string): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.title ILIKE :query', { query: `%${queryString}%` })
      .orWhere('book.author ILIKE :query', { query: `%${queryString}%` })
      .orderBy('book.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number, page: number, limit: number): Promise<any> {
    const result = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.reviews', 'review')
      .addSelect('AVG(review.rating)', 'averageRating')
      .where('book.id = :id', { id })
      .withDeleted()
      .groupBy('book.id')
      .getRawAndEntities();

    if (!result.entities.length) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const book = result.entities[0];
    const averageRating = parseFloat(result.raw[0]?.averageRating) || 0;

    const reviews = await this.reviewService.getPaginatedReviewsByBookId(
      id,
      page,
      limit,
    );
    return {
      book,
      averageRating,
      reviews,
      pagination: {
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async postReview(
    req: Request,
    bookId: number,
    dto: CreateReviewDto,
  ): Promise<Partial<Review>> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not exists`);
    }

    const reqUser = req.user as JwtPayload;

    const user = await this.userService.findOne(reqUser.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${reqUser.userId} not exists`);
    }

    const review = await this.reviewService.create(req, dto);

    return review;
  }
}
