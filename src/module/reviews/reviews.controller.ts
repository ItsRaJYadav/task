import {
  Controller,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/role.enum';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(req, id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewsService.remove(id, 1);
  }
}
