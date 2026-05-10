import { User } from '../../src/domain/entities/user/User';

export const userTestCreateProps = {
  id: 'user-id',
  email: 'test.user@example.com',
  hashedPassword: 'hashed-password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestUser() {
  return User.create(userTestCreateProps);
}
