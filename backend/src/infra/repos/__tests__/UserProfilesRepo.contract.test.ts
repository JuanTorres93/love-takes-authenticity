import { createTestUserProfile } from '../../../../tests/createEntitiesTest/userProfileCreate';
import { UserProfile } from '../../entities/userprofile/UserProfile';
import { MemoryUserProfilesRepo } from '../Memory/MemoryUserProfilesRepo';

const repos = [
  { name: 'MemoryUserProfilesRepo', repoClass: MemoryUserProfilesRepo },
  // Add more repo implementations here as needed
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let userProfile: UserProfile;

    beforeEach(async () => {
      userProfile = createTestUserProfile();

      repo = new repoClass();

      await repo.save(userProfile);
    });

    describe('getAll', () => {
      it('should return all user profiles', async () => {
        const userProfiles = await repo.getAll();

        expect(userProfiles).toEqual([userProfile]);
      });

      it('should return an empty array if no user profiles are saved', async () => {
        const emptyRepo = new repoClass();

        const userProfiles = await emptyRepo.getAll();

        expect(userProfiles).toEqual([]);
      });
    });

    describe('save', () => {
      it('should save a user profile', async () => {
        const newUserProfile = createTestUserProfile({ userId: 'new-user-id' });

        const userProfilesBefore = await repo.getAll();
        expect(userProfilesBefore).not.toContain(newUserProfile);

        await repo.save(newUserProfile);

        const userProfilesAfter = await repo.getAll();

        expect(userProfilesAfter).toContain(newUserProfile);
        expect(userProfilesAfter.length).toBe(userProfilesBefore.length + 1);
      });

      it('should update a user profile if it already existed', async () => {
        const updatedUserProfile = createTestUserProfile({ bio: 'Updated bio' });

        const userProfilesBefore = await repo.getAll();
        expect(userProfilesBefore).toContain(userProfile);

        await repo.save(updatedUserProfile);

        const userProfilesAfter = await repo.getAll();

        expect(userProfilesAfter).toContain(updatedUserProfile);
        expect(userProfilesAfter.length).toBe(userProfilesBefore.length);
      });
    });

    describe('getByUserId', () => {
      it('should return the user profile for a given user ID', async () => {
        const retrievedProfile = await repo.getByUserId(userProfile.userId);

        expect(retrievedProfile).toEqual(userProfile);
      });

      it('should return null if no user profile exists for the given user ID', async () => {
        const retrievedProfile = await repo.getByUserId('non-existent-user-id');

        expect(retrievedProfile).toBeNull();
      });
    });

    describe('deleteByUserId', () => {
      it('should delete the user profile for a given user ID', async () => {
        await repo.deleteByUserId(userProfile.userId);

        const retrievedProfile = await repo.getByUserId(userProfile.userId);
        expect(retrievedProfile).toBeNull();
      });

      it('should do nothing if no user profile exists for the given user ID', async () => {
        const userProfilesBefore = await repo.getAll();

        await repo.deleteByUserId('non-existent-user-id');

        const userProfilesAfter = await repo.getAll();
        expect(userProfilesAfter).toEqual(userProfilesBefore);
      });
    });
  });
});
