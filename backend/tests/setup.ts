import { readdirSync } from 'fs';
import { join } from 'path';

import { MemoryConversationsRepo } from '../src/infra/repos/Memory/MemoryConversationsRepo';
import { MemoryUserMatchesRepo } from '../src/infra/repos/Memory/MemoryUserMatchesRepo';
import { MemoryUserProfilesRepo } from '../src/infra/repos/Memory/MemoryUserProfilesRepo';
import { MemoryUsersRepo } from '../src/infra/repos/Memory/MemoryUsersRepo';
import { AppConversationsRepo } from '../src/interface-adapters/repos/AppConversationsRepo';
import { AppUserMatchesRepo } from '../src/interface-adapters/repos/AppUserMatchesRepo';
import { AppUserProfilesRepo } from '../src/interface-adapters/repos/AppUserProfilesRepo';
import { AppUsersRepo } from '../src/interface-adapters/repos/AppUsersRepo';

const appRepos = [
  {
    appRepo: AppConversationsRepo,
    memoryRepo: MemoryConversationsRepo,
  },
  {
    appRepo: AppUserMatchesRepo,
    memoryRepo: MemoryUserMatchesRepo,
  },
  {
    appRepo: AppUserProfilesRepo,
    memoryRepo: MemoryUserProfilesRepo,
  },
  {
    appRepo: AppUsersRepo,
    memoryRepo: MemoryUsersRepo,
  },
];

assertAllReposHaveAdapters();

appRepos.forEach(({ appRepo, memoryRepo }) => {
  assertIsMemoryRepo(appRepo, memoryRepo);
});

function assertIsMemoryRepo(appRepo: unknown, memoryRepo: new (...args: any[]) => unknown): void {
  if (!(appRepo instanceof memoryRepo)) {
    throw new Error(
      'TESTS GLOBAL SETUP: Expected appRepo to be an instance of the corresponding MemoryRepo',
    );
  }
}

function assertAllReposHaveAdapters(): void {
  const repoAdaptersDir = join(__dirname, '../src/interface-adapters/repos');
  const repoAdapterFiles = readdirSync(repoAdaptersDir).filter((f) => f.endsWith('.ts'));

  if (repoAdapterFiles.length !== appRepos.length) {
    throw new Error(
      `TESTS GLOBAL SETUP: Mismatch: found ${repoAdapterFiles.length} repo adapters but only ${appRepos.length} are registered in tests/setup.ts`,
    );
  }
}
