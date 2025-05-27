import { Book } from 'src/module/books/entities/book.entity';
import { User } from 'src/module/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Index()
  @Column({ nullable: false, type: 'int' })
  userId: number;

  @Index()
  @Column({ nullable: false, type: 'int' })
  bookId: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
