# Contributing to Love Takes Authenticity

Thanks for contributing. This project follows Clean Architecture + TDD and Stories for features. Keep things simple, tested, and inside the correct layer.

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

## 🏗️ Adding new features

1. Check if existing entities, services and/or use cases cover the logic needed for the feature (just looking the folder name should be enough).
1. If possible, create use cases and orchestrate the already existing entities and services.
1. If needed create new entities with their repos.

Use the included scripts (package.json) to generate the boilerplate for a new domain entity or use case. They will scaffold every file needed and their tests.

## 🔁 Pull Requests

- Must pass all tests
- Must include tests for new logic
