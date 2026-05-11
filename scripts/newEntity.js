#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ---- Validate input ----

const entityRaw = process.argv[2];

if (!entityRaw) {
  const scriptName = path.basename(process.argv[1]);
  console.error(`Usage: node ${scriptName} EntityName  (e.g.: node ${scriptName} WorkoutLine)`);
  process.exit(1);
}

// ---- Derived names ----

const dirName = entityRaw.toLowerCase();
const entityCamel = entityRaw[0].toLowerCase() + entityRaw.slice(1);

// ---- Roots ----

const backendRoot = path.resolve(__dirname, '..', 'backend');
const entitiesRoot = path.join(backendRoot, 'src', 'domain', 'entities');
const dtosRoot = path.join(backendRoot, 'src', 'application-layer', 'dtos');
const createTestsRoot = path.join(backendRoot, 'tests', 'createEntitiesTest');
const dtoPropsRoot = path.join(backendRoot, 'tests', 'dtoProperties');

// ---- Templates ----

const ENTITY_TEMPLATE = `import { ValidationDomainError } from '../../common/domainErrors';
import { DomainDate } from '../../value-objects/DomainDate/DomainDate';

// TODO IMPORTANT CREATE DTO

export type EntityCreateProps = {
  id: string;
  name: string;
  // More props
  createdAt: Date;
  updatedAt: Date;
};

export type EntityProps = {
  id: string; // TODO change to Value Object
  name: string; // TODO change to Value Object
  // More props
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class Entity {
  private constructor(private readonly props: EntityProps) {}

  static create(props: EntityCreateProps): Entity {
    // Validation

    const entityProps: EntityProps = {
      // TODO more props validated with Value Objects
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Entity(entityProps);
  }

  // Getters
  get id() {
    // TODO include .value when changing to Value Object
    return this.props.id;
  }

  get name() {
    // TODO include .value when changing to Value Object
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
`;

const ENTITY_TEST_TEMPLATE = `import { entityTestCreateProps } from '../../../../../tests/createEntitiesTest/entityCreate';
import { Entity, EntityCreateProps } from '../Entity';

describe('Entity', () => {
  let entity: Entity;
  let validEntityProps: EntityCreateProps;

  beforeEach(() => {
    validEntityProps = {
      ...entityTestCreateProps,
    };
    entity = Entity.create(validEntityProps);
  });

  it('should create a valid entity', () => {
    expect(entity).toBeInstanceOf(Entity);
  });
});
`;

const ENTITY_TEST_PROPS_TEMPLATE = `import { Entity, EntityCreateProps } from '../../src/domain/entities/entityname/Entity';

export const entityTestCreateProps: EntityCreateProps = {
  id: 'entity-id',
  // TODO add more props
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestEntity({
  overrideProps,
}: { overrideProps?: Partial<EntityCreateProps> } = {}): Entity {
  const props = { ...entityTestCreateProps, ...overrideProps };

  return Entity.create(props);
}
`;

const DTO_TEMPLATE = `import { Entity } from '../../domain/entities/entityname/Entity';

// TODO update props
export type EntityDTO = {
  id: string;
};

export function toEntityDTO(entity: Entity): EntityDTO {
  return {
    id: entity.id,
  };
}
`;

const DTO_TEST_TEMPLATE = `import { createTestEntity } from '../../../../tests/createEntitiesTest/entityCreate';
import { entityDTOProperties } from '../../../../tests/dtoProperties/entityDtoProperties';
import { Entity } from '../../../domain/entities/entityname/Entity';
import { EntityDTO, toEntityDTO } from '../EntityDTO';

describe('EntityDTO', () => {
  let entity: Entity;
  let entityDTO: EntityDTO;

  beforeEach(() => {
    entity = createTestEntity();
  });

  describe('toEntityDTO', () => {
    beforeEach(() => {
      entityDTO = toEntityDTO(entity);
    });

    it('should have a prop for each entity getter', () => {
      for (const getter of entityDTOProperties) {
        expect(entityDTO).toHaveProperty(getter);
      }
    });
  });
});
`;

const DTO_PROPS_TEMPLATE = `import { getGetters } from '../../src/application-layer/dtos/__tests__/_getGettersUtil';
import { Entity } from '../../src/domain/entities/entityname/Entity';
import { entityTestCreateProps } from '../createEntitiesTest/entityCreate';

const sampleEntity = Entity.create({
  ...entityTestCreateProps,
});

const allEntityGetters = getGetters(sampleEntity);

export const entityDTOProperties = [...allEntityGetters];
`;

// ---- Replacements (order matters — most specific first) ----

function applyReplacements(content, replacements) {
  return replacements.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    content,
  );
}

const REPLACEMENTS = [
  [/\bcreateTestEntity\b/g, `createTest${entityRaw}`],
  [/\bentityTestCreateProps\b/g, `${entityCamel}TestCreateProps`],
  [/\bentityCreate\b/g, `${entityCamel}Create`],
  [/\bEntityCreateProps\b/g, `${entityRaw}CreateProps`],
  [/\bEntityProps\b/g, `${entityRaw}Props`],
  [/\bEntityDTO\b/g, `${entityRaw}DTO`],
  [/\btoEntityDTO\b/g, `to${entityRaw}DTO`],
  [/\bentityDTOProperties\b/g, `${entityCamel}DTOProperties`],
  [/\bentityDtoProperties\b/g, `${entityCamel}DtoProperties`],
  [/\bEntity\b/g, entityRaw],
  [/\bentity\b/g, entityCamel],
  [/entityname/g, dirName],
  [/\bvalidEntityProps\b/g, `valid${entityRaw}Props`],
  [/valid entity/g, `valid ${entityCamel}`],
];

// ---- File definitions ----

const files = [
  {
    filePath: path.join(entitiesRoot, dirName, `${entityRaw}.ts`),
    template: ENTITY_TEMPLATE,
    dir: path.join(entitiesRoot, dirName),
  },
  {
    filePath: path.join(entitiesRoot, dirName, '__tests__', `${entityRaw}.test.ts`),
    template: ENTITY_TEST_TEMPLATE,
    dir: path.join(entitiesRoot, dirName, '__tests__'),
  },
  {
    filePath: path.join(createTestsRoot, `${entityCamel}Create.ts`),
    template: ENTITY_TEST_PROPS_TEMPLATE,
    dir: createTestsRoot,
  },
  {
    filePath: path.join(dtosRoot, `${entityRaw}DTO.ts`),
    template: DTO_TEMPLATE,
    dir: dtosRoot,
  },
  {
    filePath: path.join(dtosRoot, '__tests__', `${entityRaw}DTO.test.ts`),
    template: DTO_TEST_TEMPLATE,
    dir: path.join(dtosRoot, '__tests__'),
  },
  {
    filePath: path.join(dtoPropsRoot, `${entityCamel}DtoProperties.ts`),
    template: DTO_PROPS_TEMPLATE,
    dir: dtoPropsRoot,
  },
];

// ---- Check for existing files ----

for (const { filePath } of files) {
  if (fs.existsSync(filePath)) {
    console.error(
      `❌ Error: '${path.relative(process.cwd(), filePath)}' already exists. Aborting to avoid overwriting.`,
    );
    process.exit(1);
  }
}

// ---- Write files ----

console.log('✅ Scaffolding created:');
for (const { filePath, template, dir } of files) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, applyReplacements(template, REPLACEMENTS), 'utf8');
  console.log(`  - ${path.relative(process.cwd(), filePath)}`);
}
