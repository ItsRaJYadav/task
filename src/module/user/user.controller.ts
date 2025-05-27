import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('list')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
