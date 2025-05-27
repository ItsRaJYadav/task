import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class UserService {
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_ORDER = 'DESC';
  private readonly DEFAULT_WITH_DELETED = false;
  private logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: this.DEFAULT_WITH_DELETED,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = this.userRepository.create(createUserDto);

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ users: User[]; count: number }> {
    const { page = this.DEFAULT_PAGE, limit = this.DEFAULT_LIMIT } =
      paginationDto;
    // const user = req .
    try {
      const [users, count] = await this.userRepository
        .createQueryBuilder('user')
        .withDeleted()
        .orderBy('user.createdAt', this.DEFAULT_ORDER)
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return { count, users };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
        withDeleted: false,
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('Email already in use by another user');
      }
    }

    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (result.affected === 1) {
      throw new ConflictException(`User with ID ${id} already deleted`);
    }

    return { message: `User with ID ${id} has been successfully deleted` };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: false,
    });

    if (!user) {
      throw new NotFoundException(`your email ${email} not registered`);
    }
    return user;
  }
}
