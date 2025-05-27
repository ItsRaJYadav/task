import { IsEnum } from 'class-validator';
import { UserRole } from '../../../enums/role.enum';
import { BaseCreateUserDto } from './base-user-create.dto';

export class CreateUserDto extends BaseCreateUserDto {
  @IsEnum(UserRole)
  role: UserRole;
}
