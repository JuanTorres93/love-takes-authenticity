import { createTestUser } from '../../../../tests/createEntitiesTest/userCreate';
import { MemoryUsersRepo } from '../../../infra/repos/MemoryUsersRepo';
import { User } from '../../entities/user/User';

const repos = [
  { name: 'MemoryUsersRepo', repoClass: MemoryUsersRepo },
  // Add more repo implementations here as needed
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let user: User;

    beforeEach(async () => {
      user = createTestUser();

      repo = new repoClass();

      await repo.save(user);
    });

    describe('getAll', () => {
      it('should return all users', async () => {
        const users = await repo.getAll();

        expect(users).toEqual([user]);
      });

      it('should return an empty array if no users are saved', async () => {
        const emptyRepo = new repoClass();

        const users = await emptyRepo.getAll();

        expect(users).toEqual([]);
      });
    });

    describe('save', () => {
      it('should save a user', async () => {
        const newUser = createTestUser({ id: 'new-user-id' });

        const usersBefore = await repo.getAll();
        expect(usersBefore).not.toContain(newUser);

        await repo.save(newUser);

        const usersAfter = await repo.getAll();
        expect(usersAfter).toContain(newUser);
        expect(usersAfter.length).toBe(usersBefore.length + 1);
      });

      it('should update a user if it already existed', async () => {
        const updatedUser = createTestUser({ email: 'updated-email@example.com' });

        const usersBefore = await repo.getAll();
        expect(usersBefore).toContain(user);

        await repo.save(updatedUser);

        const usersAfter = await repo.getAll();

        expect(usersAfter).toContain(updatedUser);
        expect(usersAfter.length).toBe(usersBefore.length);
      });
    });

    describe('getById', () => {
      it('should return a user by id', async () => {
        const foundUser = await repo.getById(user.id);

        expect(foundUser).toEqual(user);
      });

      it('should return null if user is not found', async () => {
        const foundUser = await repo.getById('non-existent-id');

        expect(foundUser).toBeNull();
      });
    });

    describe('deleteById', () => {
      it('should delete a user by id', async () => {
        await repo.deleteById(user.id);

        const foundUser = await repo.getById(user.id);
        expect(foundUser).toBeNull();
      });

      it('should do nothing if user is not found', async () => {
        const usersBefore = await repo.getAll();

        await repo.deleteById('non-existent-id');

        const usersAfter = await repo.getAll();
        expect(usersAfter).toEqual(usersBefore);
      });
    });
  });
});
