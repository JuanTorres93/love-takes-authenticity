import { User } from '../../domain/entities/user/User';

export type UserDTO = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
