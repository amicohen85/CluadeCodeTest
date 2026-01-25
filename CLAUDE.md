# CLAUDE.md - AI Assistant Guidelines

This file provides guidance for AI assistants (like Claude) working with this codebase.

## Repository Overview

**Project Name:** System Analyst AI
**Status:** Active Development
**Last Updated:** 2026-01-25
**Version:** 1.0.0

---

## Project Description

**System Analyst AI** is an AI-powered web platform designed for system analysts. It leverages AI agents (Claude/GPT-4) to automate the creation of:

- **Specification Documents** - Comprehensive system requirements documentation
- **AGILE Artifacts** - Epics, User Stories, Tasks with story point estimation
- **UI/UX Designs** - Screen specifications, wireframes, user flows, design systems
- **Architecture Diagrams** - System architecture, interface specs, database schemas, C4 models

### Target Users
- System Analysts
- Product Managers
- Solution Architects
- Development Team Leads

### Key Features
1. AI-powered document generation
2. Multi-format output (Markdown, JSON, Mermaid diagrams)
3. Project management capabilities
4. Hebrew and English language support
5. Integration with Claude and GPT-4 APIs

---

## Directory Structure

```
/
├── CLAUDE.md                    # AI assistant guidelines (this file)
├── backend/                     # Node.js/Express backend
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Environment variables template
│   └── src/
│       ├── index.js            # Express server entry point
│       ├── agents/             # AI Agent implementations
│       │   ├── BaseAgent.js    # Base agent class with AI integration
│       │   ├── SpecificationAgent.js  # Specification document generator
│       │   ├── AgileAgent.js   # AGILE artifacts generator
│       │   ├── DesignAgent.js  # UI/UX design generator
│       │   └── ArchitectureAgent.js   # Architecture diagram generator
│       ├── routes/             # API route handlers
│       │   ├── projectRoutes.js
│       │   ├── specificationRoutes.js
│       │   ├── agileRoutes.js
│       │   ├── designRoutes.js
│       │   └── architectureRoutes.js
│       └── utils/
│           └── logger.js       # Winston logger configuration
└── frontend/                    # React frontend
    ├── package.json            # Frontend dependencies
    ├── vite.config.js          # Vite configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    ├── index.html              # HTML entry point
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Main application component
        ├── components/
        │   └── Layout.jsx      # Main layout with navigation
        ├── pages/
        │   ├── Dashboard.jsx   # Home dashboard
        │   ├── ProjectsPage.jsx
        │   ├── SpecificationPage.jsx
        │   ├── AgilePage.jsx
        │   ├── DesignPage.jsx
        │   └── ArchitecturePage.jsx
        ├── services/
        │   └── api.js          # API client (axios)
        └── styles/
            └── index.css       # Global styles (Tailwind)
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **AI SDKs:** Anthropic SDK, OpenAI SDK
- **Logging:** Winston
- **Security:** Helmet, express-rate-limit
- **Validation:** express-validator

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Diagrams:** Mermaid.js
- **UI Components:** Radix UI

---

## Development Workflow

### Getting Started

```bash
# Clone the repository
git clone https://github.com/amicohen85/CluadeCodeTest.git
cd CluadeCodeTest

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Setup

Create `backend/.env` with:
```env
PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

### Common Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | backend/ | Start backend in dev mode (nodemon) |
| `npm start` | backend/ | Start backend in production mode |
| `npm run dev` | frontend/ | Start frontend dev server (Vite) |
| `npm run build` | frontend/ | Build frontend for production |
| `npm test` | backend/ | Run backend tests (Jest) |
| `npm run lint` | both | Run ESLint |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET/POST | `/api/projects` | Project management |
| POST | `/api/specifications/generate` | Generate specification document |
| POST | `/api/agile/breakdown` | Break down to AGILE tasks |
| POST | `/api/agile/sprint-plan` | Generate sprint plan |
| POST | `/api/design/screens` | Generate screen designs |
| POST | `/api/design/user-flow` | Generate user flow diagrams |
| POST | `/api/architecture/generate` | Generate system architecture |
| POST | `/api/architecture/interface` | Generate API specifications |
| POST | `/api/architecture/database` | Generate database schema |

---

## Code Conventions

### General Guidelines

- Use ES Modules (`import/export`) throughout
- Write clean, readable, and self-documenting code
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names
- Add comments only when the "why" isn't obvious

### File Naming

- **Components:** PascalCase - `MyComponent.jsx`
- **Utilities:** camelCase - `formatDate.js`
- **Routes:** camelCase with suffix - `projectRoutes.js`
- **Agents:** PascalCase with suffix - `SpecificationAgent.js`

### Code Style

- Indent with 2 spaces
- Use single quotes for strings
- Add trailing commas in multi-line structures
- Keep line length under 100 characters
- Use async/await for asynchronous operations

### React Patterns

- Functional components with hooks
- Destructure props
- Use `useState` and `useEffect` appropriately
- Keep components focused and composable

---

## AI Agents Architecture

### BaseAgent (base class)
All agents extend `BaseAgent` which provides:
- AI provider abstraction (Anthropic/OpenAI)
- Message processing
- Structured output parsing
- Error handling and logging

### Agent Types

1. **SpecificationAgent**
   - `generateSpecification()` - Full specification document
   - `generateSection()` - Specific sections (functional, nonFunctional, etc.)
   - `analyzeSpecification()` - Analyze existing specs

2. **AgileAgent**
   - `breakdownSpecification()` - Epics & User Stories
   - `generateSprintPlan()` - Sprint planning
   - `estimateStoryPoints()` - Story point estimation
   - `generateDefinitionOfDone()` - DoD checklists

3. **DesignAgent**
   - `generateScreenDesigns()` - Screen specifications
   - `generateUserFlow()` - User flow diagrams
   - `generateDesignSystem()` - Design tokens
   - `generateWireframe()` - ASCII wireframes

4. **ArchitectureAgent**
   - `generateArchitecture()` - System architecture
   - `generateInterfaceSpec()` - API specifications
   - `generateDatabaseSchema()` - ERD and DDL
   - `generateIntegrationArchitecture()` - Integration patterns
   - `generateC4Model()` - C4 diagrams

---

## Testing Guidelines

### Running Tests

```bash
# Backend tests
cd backend
npm test
npm test -- --coverage

# Frontend tests
cd frontend
npm test
```

### Writing Tests

- Place test files in `tests/` directory or next to source files
- Use `.test.js` or `.spec.js` suffix
- Follow AAA pattern: Arrange, Act, Assert
- Mock external APIs (AI services)

---

## Architecture Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-25 | Node.js + Express backend | Mature ecosystem, good AI SDK support |
| 2026-01-25 | React + Vite frontend | Fast development, modern tooling |
| 2026-01-25 | Tailwind CSS | Rapid UI development, consistent styling |
| 2026-01-25 | Multi-agent architecture | Separation of concerns, specialized AI prompts |
| 2026-01-25 | Mermaid for diagrams | Text-based, version-controllable diagrams |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `backend/src/index.js` | Express server setup, middleware, routes |
| `backend/src/agents/BaseAgent.js` | Base AI agent with provider abstraction |
| `frontend/src/App.jsx` | React app root with routing |
| `frontend/src/components/Layout.jsx` | Main layout with sidebar navigation |
| `frontend/src/services/api.js` | Axios API client |

---

## AI Assistant Instructions

### Do's

- **Read before writing:** Always read existing files before modifications
- **Follow existing patterns:** Match code style and conventions
- **Keep changes minimal:** Only make requested changes
- **Test your changes:** Run tests after modifications
- **Update CLAUDE.md:** Keep documentation current
- **Use the agent pattern:** New AI features should follow the agent architecture

### Don'ts

- **Don't over-engineer:** Avoid unnecessary complexity
- **Don't ignore errors:** Address build/test failures
- **Don't assume:** Read code to understand context
- **Don't break API contracts:** Maintain backwards compatibility
- **Don't hardcode secrets:** Use environment variables

### Adding a New AI Agent

1. Create new file in `backend/src/agents/` extending `BaseAgent`
2. Implement specialized system prompt via `getSystemPrompt()`
3. Add processing methods for specific tasks
4. Create corresponding route in `backend/src/routes/`
5. Add API functions in `frontend/src/services/api.js`
6. Create frontend page in `frontend/src/pages/`
7. Update navigation in `Layout.jsx`
8. Document in this file

---

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | No | `3001` |
| `NODE_ENV` | Runtime environment | No | `development` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes* | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes* | - |
| `AI_PROVIDER` | AI provider (anthropic/openai) | No | `anthropic` |
| `LOG_LEVEL` | Logging level | No | `info` |

*At least one AI provider key is required

---

## Troubleshooting

### Common Issues

**Issue:** "API key not configured" error
**Solution:** Ensure `.env` file exists in `backend/` with valid API keys

**Issue:** Frontend can't connect to backend
**Solution:** Check that backend is running on port 3001, verify Vite proxy config

**Issue:** Mermaid diagrams not rendering
**Solution:** Ensure mermaid is properly initialized, check browser console for errors

**Issue:** Rate limit errors from AI provider
**Solution:** Reduce request frequency or upgrade API plan

---

## Resources

- **Repository:** [GitHub](https://github.com/amicohen85/CluadeCodeTest)
- **Anthropic API:** [Documentation](https://docs.anthropic.com)
- **OpenAI API:** [Documentation](https://platform.openai.com/docs)
- **Mermaid:** [Documentation](https://mermaid.js.org)
- **Tailwind CSS:** [Documentation](https://tailwindcss.com/docs)

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-25 | Claude | Initial CLAUDE.md created |
| 2026-01-25 | Claude | Full system implementation: backend, frontend, AI agents |

---

*This file should be updated as the project evolves. AI assistants should check this file at the start of each session for the latest guidelines.*
