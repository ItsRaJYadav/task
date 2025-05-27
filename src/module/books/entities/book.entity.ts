import { Review } from 'src/module/reviews/entities/review.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('books')
@Index(['title', 'author'], { unique: true })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  publishedYear: number;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
