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

## 🔁 Pull Requests

- Must pass tests
- Must include tests for new logic
