import { UserDTO } from 'shared';

import { User } from '../../domain/entities/user/User';

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
