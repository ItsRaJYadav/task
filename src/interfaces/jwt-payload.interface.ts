import { UserRole } from 'src/enums/role.enum';

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
  sub: string;
}
