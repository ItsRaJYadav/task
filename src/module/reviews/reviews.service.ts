import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(
    req: Request,
    createReviewDto: CreateReviewDto,
  ): Promise<Partial<Review>> {
    const { bookId } = createReviewDto;
    const reqUser = req.user as JwtPayload;

    this.logger.log('reqUser is the user', reqUser.userId);

    const existingReview = await this.reviewRepository.findOne({
      where: { userId: reqUser.userId, bookId },
    });

    if (existingReview) {
      throw new ConflictException(
        'User has already submitted a review for this book',
      );
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId: reqUser.userId,
    });

    const savedReview = await this.reviewRepository.save(review);

    const { id, rating, comment, userId } = savedReview;
    return { id, rating, comment, userId };
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ['user', 'book'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'book'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(
    req: Request,
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const existingReview = await this.reviewRepository.findOne({
      where: { id },
    });
    const reqUser = req.user as JwtPayload;
    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (reqUser.userId !== existingReview.userId) {
      throw new ForbiddenException(
        'You are not authorized to update this review',
      );
    }

    const review = await this.reviewRepository.preload({
      id,
      ...updateReviewDto,
    });

    if (!review) {
      throw new NotFoundException(`Unable to preload review with ID ${id}`);
    }

    return await this.reviewRepository.save(review);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const existingReview = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (existingReview.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this review',
      );
    }

    await this.reviewRepository.delete(id);

    return { message: `Review with ID ${id} deleted successfully` };
  }

  async getPaginatedReviewsByBookId(
    bookId: number,
    page: number,
    limit: number,
  ): Promise<any[]> {
    const offset = (page - 1) * limit;

    return this.reviewRepository
      .createQueryBuilder('review')
      .select([
        'review.id',
        'review.comment',
        'review.rating',
        'review.createdAt',
      ])
      .where('review.bookId = :bookId', { bookId })
      .orderBy('review.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
  }
}
