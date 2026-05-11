import { User, UserCreateProps } from '../../src/domain/entities/user/User';

export const testUserId = 'user-id';

export const userTestCreateProps = {
  id: testUserId,
  email: 'test.user@example.com',
  hashedPassword: 'hashed-password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestUser(overrideProps: Partial<UserCreateProps> = {}) {
  const props = { ...userTestCreateProps, ...overrideProps };

  return User.create(props);
}
