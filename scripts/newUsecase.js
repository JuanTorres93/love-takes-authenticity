#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ---- Validate input ----

const VALID_PROJECTS = ['backend', 'frontend-web', 'frontend-mobile'];

const projectArg = process.argv[2];
const usecaseRaw = process.argv[3];

const scriptName = path.basename(process.argv[1]);

if (!projectArg || !VALID_PROJECTS.includes(projectArg) || !usecaseRaw) {
  console.error(
    `Usage: node ${scriptName} <project> UsecaseName\n` +
      `  project: ${VALID_PROJECTS.join(' | ')}\n` +
      `  e.g.: node ${scriptName} backend GetAssembledDayById`,
  );
  process.exit(1);
}

// ---- Derived names ----

const dirName = `${usecaseRaw}Usecase`;
const usecaseCamel = usecaseRaw[0].toLowerCase() + usecaseRaw.slice(1);

// ---- Paths ----

const monorepoRoot = path.resolve(__dirname, '..');
const useCasesRoot = path.join(monorepoRoot, projectArg, 'src', 'application-layer', 'use-cases');
const usecaseDir = path.join(useCasesRoot, dirName);
const testDir = path.join(usecaseDir, '__tests__');

// ---- Templates ----

const USECASE_TEMPLATE = `import { NotFoundApplicationError } from '../../common/applicationErrors';

export type PLACEHOLDERUsecaseRequest = {
  xxxxId: string;
};

export class PLACEHOLDERUsecase {
  constructor(private xxxxRepo: XxxxRepo) {}

  async execute(
    request: PLACEHOLDERUsecaseRequest,
  ): Promise<XxxxDTO> {
    const xxxx = await this.xxxxRepo.getXxxxById(request.xxxxId);
    if (!xxxx) {
      throw new NotFoundApplicationError(
        \`PLACEHOLDERUsecase: Xxxx with id \${request.xxxxId} not found\`,
      );
    }

    // TODO IMPORTANT: Finish writing the usecase

    return toXxxxDTO(xxxx);
  }
}
`;

const TEST_TEMPLATE = `import { NotFoundApplicationError } from '../../../../common/applicationErrors';
import { PLACEHOLDERUsecase } from '../PLACEHOLDERUsecase';

import { createTestXxxx } from '../../../../../tests/createEntitiesTest/xxxxCreate';

describe('PLACEHOLDERUsecase', () => {
  let xxxxRepo: MemoryXxxxRepo;
  let usecase: PLACEHOLDERUsecase;
  let xxxx: Xxxx; // TODO: initialize with a valid Xxxx entity

  beforeEach(async () => {
    xxxxRepo = new MemoryXxxxRepo();
    usecase = new PLACEHOLDERUsecase(xxxxRepo);

    // TODO: create xxxx and save it
    xxxx = createTestXxxx();
    await xxxxRepo.saveXxxx(xxxx);
  });

  describe('Execution', () => {
    it('should return XxxxDTO', async () => {
      const result = await usecase.execute({
        xxxxId: xxxx.id,
      });

      expect(result).not.toBeInstanceOf(Xxxx);
      for (const prop of xxxxDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  // describe('Errors', () => {
  // });
});
`;

// ---- File definitions ----

const files = [
  {
    filePath: path.join(usecaseDir, `${usecaseRaw}Usecase.ts`),
    template: USECASE_TEMPLATE,
    dir: usecaseDir,
  },
  {
    filePath: path.join(testDir, `${usecaseRaw}Usecase.test.ts`),
    template: TEST_TEMPLATE,
    dir: testDir,
  },
];

// ---- Check for existing files ----

for (const { filePath } of files) {
  if (fs.existsSync(filePath)) {
    console.error(
      `❌ Error: '${path.relative(monorepoRoot, filePath)}' already exists. Aborting to avoid overwriting.`,
    );
    process.exit(1);
  }
}

// ---- Write files ----

console.log('✅ Scaffolding created:');
for (const { filePath, template, dir } of files) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, template.replace(/PLACEHOLDER/g, usecaseRaw), 'utf8');
  console.log(`  - ${path.relative(monorepoRoot, filePath)}`);
}
