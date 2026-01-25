# CLAUDE.md - AI Assistant Guidelines

This file provides guidance for AI assistants (like Claude) working with this codebase.

## Repository Overview

**Project Name:** CluadeCodeTest
**Status:** New/Empty Repository
**Last Updated:** 2026-01-25

> **Note:** This repository is currently empty. Update this file as the project develops.

---

## Project Description

<!-- TODO: Add project description when initialized -->
This is a new repository awaiting project initialization. Update this section with:
- What the project does
- Key features and functionality
- Target users/audience

---

## Directory Structure

```
/
├── CLAUDE.md           # This file - AI assistant guidelines
└── (awaiting project initialization)
```

<!-- TODO: Update structure as project develops. Example:
/
├── src/                # Source code
│   ├── components/     # UI components
│   ├── utils/          # Utility functions
│   └── index.ts        # Entry point
├── tests/              # Test files
├── docs/               # Documentation
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── CLAUDE.md           # AI assistant guidelines
-->

---

## Technology Stack

<!-- TODO: Update when project is initialized -->
- **Language:** TBD
- **Framework:** TBD
- **Build Tool:** TBD
- **Testing:** TBD
- **Package Manager:** TBD

---

## Development Workflow

### Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd CluadeCodeTest

# TODO: Add setup commands when project is initialized
# npm install / yarn install / pip install -r requirements.txt / etc.
```

### Common Commands

<!-- TODO: Update with actual commands -->
| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run lint` | Run linter |

### Git Workflow

1. Create feature branch from main: `git checkout -b feature/your-feature`
2. Make changes and commit with descriptive messages
3. Push branch and create pull request
4. Request review and merge after approval

---

## Code Conventions

### General Guidelines

- Write clean, readable, and self-documenting code
- Follow the principle of least surprise
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names
- Add comments only when the "why" isn't obvious from the code

### File Naming

<!-- TODO: Update based on project conventions -->
- Use kebab-case for file names: `my-component.ts`
- Use PascalCase for component files: `MyComponent.tsx`
- Use camelCase for utility files: `formatDate.ts`

### Code Style

<!-- TODO: Update based on project's linting configuration -->
- Indent with 2 spaces (or tabs based on project config)
- Use single quotes for strings (or double based on config)
- Add trailing commas in multi-line structures
- Keep line length under 100 characters

---

## Testing Guidelines

<!-- TODO: Update when testing is configured -->

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.spec.ts

# Run with coverage
npm test -- --coverage
```

### Writing Tests

- Place test files next to source files or in `__tests__` directory
- Name test files with `.test.ts` or `.spec.ts` suffix
- Write descriptive test names that explain the expected behavior
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies appropriately

---

## Architecture Decisions

<!-- TODO: Document key architectural decisions as they are made -->

### Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-25 | Repository created | Initial setup |

---

## Key Files Reference

<!-- TODO: Update as important files are added -->

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guidelines (this file) |
| `README.md` | Project documentation (TBD) |
| `package.json` | Dependencies and scripts (TBD) |

---

## AI Assistant Instructions

When working with this codebase, AI assistants should:

### Do's

- **Read before writing:** Always read existing files before making modifications
- **Follow existing patterns:** Match the code style and conventions already in use
- **Keep changes minimal:** Only make changes that are directly requested
- **Test your changes:** Run tests after making modifications
- **Commit appropriately:** Use clear, descriptive commit messages
- **Update documentation:** Keep this file and other docs up to date

### Don'ts

- **Don't over-engineer:** Avoid adding unnecessary complexity or features
- **Don't ignore errors:** Address build/test failures before continuing
- **Don't assume:** Read code to understand context rather than guessing
- **Don't break conventions:** Follow established patterns in the codebase
- **Don't forget edge cases:** Consider error handling and boundary conditions

### Common Tasks

#### Adding a New Feature
1. Understand the existing architecture
2. Plan the implementation approach
3. Write the feature code following conventions
4. Add appropriate tests
5. Update documentation if needed
6. Commit with descriptive message

#### Fixing a Bug
1. Reproduce and understand the issue
2. Find the root cause in the code
3. Implement the minimal fix
4. Add a test to prevent regression
5. Verify the fix doesn't break other functionality
6. Commit with reference to the issue

#### Refactoring Code
1. Ensure tests exist for the code being refactored
2. Make incremental changes
3. Run tests after each change
4. Keep the external API stable if possible
5. Document any breaking changes

---

## Environment Variables

<!-- TODO: Document environment variables when they are added -->

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Runtime environment | No | `development` |

---

## Troubleshooting

<!-- TODO: Add common issues and solutions as they arise -->

### Common Issues

**Issue:** TBD
**Solution:** TBD

---

## Resources

<!-- TODO: Add relevant links -->

- **Repository:** [GitHub](https://github.com/amicohen85/CluadeCodeTest)
- **Documentation:** TBD
- **Issue Tracker:** TBD

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-25 | Claude | Initial CLAUDE.md created |

---

*This file should be updated as the project evolves. AI assistants should check this file at the start of each session for the latest guidelines.*
