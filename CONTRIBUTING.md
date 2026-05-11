# Contributing to Love Takes Authenticity

Thanks for contributing. This project follows Clean Architecture + TDD. Keep things simple, tested, and inside the correct layer.

## 🧠 Core rules

- Tests first (TDD) → no feature without tests
- Domain is sacred → no framework / DB / HTTP imports here
- Keep it simple → readability > clever code

## 🚀 Getting started

1. Fork the repository on GitHub
2. Clone your fork locally

```bash
git clone https://github.com/<your-username>/love-takes-authenticity.git

cd love-takes-authenticity

npm install
npm test
```

## 🧱 Architecture

```
domain/             # Business logic (no dependencies)
application/        # Use cases (orchestration) and DTOs
interface-adapters/ # Dependency injection
infrastructure/     # DB, HTTP, external services
```

**Rule:** dependencies only go inward

```
infrastructure → interface-adapters → application → domain
```

## ✍️ Code style

- Small functions
- Clear names (`createUser`, not `cu`)
- No side effects in domain
- No `any` unless justified
- Prefer domain types over primitives
- Use prettier

## 🏗️ Scaffolding a new entity

Use the included script to generate the boilerplate for a new domain entity:

```bash
npm run new-entity EntityName
# Example:
npm run new-entity Message
```

This creates three files:

```
backend/src/domain/entities/entityname/
  EntityName.ts                         # Entity class with typed props and getters
  __tests__/
    EntityName.test.ts                  # Vitest test file with a basic describe block

backend/tests/createEntitiesTest/
  entityNameCreate.ts                   # Placeholder test props for the entity
```

All files use `Entity` as a placeholder that is replaced with your entity name. They include `TODO` comments to guide implementation — replace primitive types with Value Objects, add validation, and fill in your props.

## 🔁 Pull Requests

- Must pass tests
- Must include tests for new logic
