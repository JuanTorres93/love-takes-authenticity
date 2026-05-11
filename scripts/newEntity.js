#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const entityRaw = process.argv[2];

if (!entityRaw) {
  const scriptName = path.basename(process.argv[1]);
  console.error(`Usage: node ${scriptName} EntityName  (e.g.: node ${scriptName} WorkoutLine)`);
  process.exit(1);
}

const dirName = entityRaw.toLowerCase();
const entityCamel = entityRaw[0].toLowerCase() + entityRaw.slice(1);

const entitiesRoot = path.resolve(__dirname, '..', 'backend', 'src', 'domain', 'entities');
const entityDir = path.join(entitiesRoot, dirName);
const entityTsPath = path.join(entityDir, `${entityRaw}.ts`);
const testTsPath = path.join(entityDir, '__tests__', `${entityRaw}.test.ts`);

for (const filePath of [entityTsPath, testTsPath]) {
  if (fs.existsSync(filePath)) {
    console.error(
      `❌ Error: '${path.relative(process.cwd(), filePath)}' already exists. Aborting to avoid overwriting.`,
    );
    process.exit(1);
  }
}

fs.mkdirSync(path.join(entityDir, '__tests__'), { recursive: true });

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

const TEST_TEMPLATE = `import { entityTestCreateProps } from '../../../../../tests/createEntitiesTest/entityCreate';
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

// ---- Apply replacements (order matters) ----

function applyReplacements(content, replacements) {
  return replacements.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    content,
  );
}

const entityContent = applyReplacements(ENTITY_TEMPLATE, [
  [/\bEntityCreateProps\b/g, `${entityRaw}CreateProps`],
  [/\bEntityProps\b/g, `${entityRaw}Props`],
  [/\bEntity\b/g, entityRaw],
]);

const testContent = applyReplacements(TEST_TEMPLATE, [
  [/\bentityTestCreateProps\b/g, `${entityCamel}TestCreateProps`],
  [/entityCreate\b/g, `${entityCamel}Create`],
  [/\bEntityCreateProps\b/g, `${entityRaw}CreateProps`],
  [/\bEntity\b/g, entityRaw],
  [/\bentity\b/g, entityCamel],
  [/\bvalidEntityProps\b/g, `valid${entityRaw}Props`],
  [/valid entity/g, `valid ${entityCamel}`],
]);

const testsRoot = path.resolve(__dirname, '..', 'backend', 'tests', 'createEntitiesTest');
const propsTsPath = path.join(testsRoot, `${entityCamel}Create.ts`);

if (fs.existsSync(propsTsPath)) {
  console.error(
    `❌ Error: '${path.relative(process.cwd(), propsTsPath)}' already exists. Aborting to avoid overwriting.`,
  );
  process.exit(1);
}

const propsContent = `import { ${entityRaw}CreateProps } from '../../src/domain/entities/${dirName}/${entityRaw}';

export const ${entityCamel}TestCreateProps: ${entityRaw}CreateProps = {
  id: '${entityCamel}-id',
  // TODO add more props
  createdAt: new Date(),
  updatedAt: new Date(),
};
`;

fs.mkdirSync(testsRoot, { recursive: true });
fs.writeFileSync(entityTsPath, entityContent, 'utf8');
fs.writeFileSync(testTsPath, testContent, 'utf8');
fs.writeFileSync(propsTsPath, propsContent, 'utf8');

const relEntity = path.relative(process.cwd(), entityTsPath);
const relTest = path.relative(process.cwd(), testTsPath);
const relProps = path.relative(process.cwd(), propsTsPath);

console.log('✅ Scaffolding created:');
console.log(`  - ${relEntity}`);
console.log(`  - ${relTest}`);
console.log(`  - ${relProps}`);
