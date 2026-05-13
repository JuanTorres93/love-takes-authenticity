import {
  createTestUserMatches,
  userMatchesTestCreateProps,
} from '../../../../tests/createEntitiesTest/userMatchesCreate';
import { MemoryUserMatchesRepo } from '../../../infra/repos/MemoryUserMatchesRepo';
import { UserMatches } from '../../entities/usermatches/UserMatches';

const repos = [
  { name: 'MemoryUserMatchesRepo', repoClass: MemoryUserMatchesRepo },
  // Add more repo implementations here as needed
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let userMatches: UserMatches;

    beforeEach(async () => {
      userMatches = createTestUserMatches();

      repo = new repoClass();

      await repo.save(userMatches);
    });

    describe('getAll', () => {
      it('should return all user matches', async () => {
        const allUserMatches = await repo.getAll();

        expect(allUserMatches).toEqual([userMatches]);
      });

      it('should return an empty array if no user matches are saved', async () => {
        const emptyRepo = new repoClass();

        const allUserMatches = await emptyRepo.getAll();

        expect(allUserMatches).toEqual([]);
      });
    });

    describe('save', () => {
      it('should save user matches', async () => {
        const newUserMatches = createTestUserMatches({ id: 'new-matches-id' });

        const matchesBefore = await repo.getAll();
        expect(matchesBefore).not.toContain(newUserMatches);

        await repo.save(newUserMatches);

        const matchesAfter = await repo.getAll();

        expect(matchesAfter).toContain(newUserMatches);
        expect(matchesAfter.length).toBe(matchesBefore.length + 1);
      });

      it('should update user matches if they already existed', async () => {
        const updatedUserMatches = createTestUserMatches({ currentlyMatchedUserIds: [] });

        const matchesBefore = await repo.getAll();
        expect(matchesBefore).toContain(userMatches);

        await repo.save(updatedUserMatches);

        const matchesAfter = await repo.getAll();

        expect(matchesAfter).toContain(updatedUserMatches);
        expect(matchesAfter.length).toBe(matchesBefore.length);

        expect(matchesAfter[0]).toEqual(updatedUserMatches);
      });
    });

    describe('getByUserId', () => {
      it('should return user matches for a given user ID', async () => {
        const retrieved = await repo.getByUserId(userMatchesTestCreateProps.userId);

        expect(retrieved).toEqual(userMatches);
      });

      it('should return null if no user matches exist for the given user ID', async () => {
        const retrieved = await repo.getByUserId('non-existent-user-id');

        expect(retrieved).toBeNull();
      });
    });

    describe('deleteByUserId', () => {
      it('should delete user matches for a given user ID', async () => {
        await repo.deleteByUserId(userMatchesTestCreateProps.userId);

        const retrieved = await repo.getByUserId(userMatchesTestCreateProps.userId);

        expect(retrieved).toBeNull();
      });

      it('should do nothing if no user matches exist for the given user ID', async () => {
        const matchesBefore = await repo.getAll();

        await repo.deleteByUserId('non-existent-user-id');

        const matchesAfter = await repo.getAll();

        expect(matchesAfter).toEqual(matchesBefore);
      });
    });
  });
});
