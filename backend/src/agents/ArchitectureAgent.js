import { BaseAgent } from './BaseAgent.js';

/**
 * Architecture Agent - Creates system architecture diagrams, interface mappings,
 * and technical design specifications
 */
export class ArchitectureAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      ...config,
      name: 'ArchitectureAgent'
    });
  }

  getSystemPrompt(context = {}) {
    return `You are an expert Solutions Architect AI assistant specializing in system design, architecture diagrams, and interface specifications.

Your expertise includes:
1. **System Architecture** - Microservices, monolithic, serverless, hybrid
2. **Architecture Patterns** - MVC, CQRS, Event-Driven, Hexagonal, Clean Architecture
3. **Integration Patterns** - REST, GraphQL, gRPC, Message Queues, Event Streaming
4. **Cloud Architecture** - AWS, Azure, GCP service mappings
5. **Database Design** - SQL, NoSQL, data modeling, sharding strategies
6. **Security Architecture** - Authentication, authorization, encryption, compliance
7. **Scalability Patterns** - Load balancing, caching, CDN, horizontal/vertical scaling
8. **API Design** - OpenAPI/Swagger specifications, versioning, documentation

Output Format:
- Provide Mermaid diagrams for visual representations
- Include detailed component specifications
- Document all interfaces and data contracts
- Consider non-functional requirements (performance, security, scalability)

Architecture Style: ${context.architectureStyle || 'Modern cloud-native'}`;
  }

  /**
   * Generate complete system architecture
   */
  async generateArchitecture(requirements) {
    const { systemName, description, components, integrations, requirements: reqs } = requirements;

    const prompt = `Please design a comprehensive system architecture for:

**System Name:** ${systemName}
**Description:** ${description}

**Required Components:**
${Array.isArray(components) ? components.map((c, i) => `${i + 1}. ${c}`).join('\n') : components || 'To be determined based on requirements'}

**External Integrations:**
${Array.isArray(integrations) ? integrations.map((i, idx) => `${idx + 1}. ${i}`).join('\n') : integrations || 'None specified'}

**Requirements:**
${JSON.stringify(reqs || {}, null, 2)}

Please provide:

1. **High-Level Architecture Diagram (Mermaid):**
\`\`\`mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web App]
        MOBILE[Mobile App]
    end
    subgraph "API Gateway"
        GW[API Gateway]
    end
    subgraph "Services"
        SVC1[Service 1]
        SVC2[Service 2]
    end
    subgraph "Data Layer"
        DB[(Database)]
        CACHE[(Cache)]
    end
    WEB --> GW
    MOBILE --> GW
    GW --> SVC1
    GW --> SVC2
    SVC1 --> DB
    SVC2 --> CACHE
\`\`\`

2. **Component Specifications:**
For each component:
- Purpose and responsibilities
- Technology stack
- Interfaces (input/output)
- Dependencies
- Scaling requirements

3. **Data Flow Diagram**

4. **Deployment Architecture**

5. **Security Architecture**

Output as JSON with embedded Mermaid diagrams.`;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate interface/API specifications
   */
  async generateInterfaceSpec(interfaceReq) {
    const { interfaceName, type, producer, consumer, dataContract } = interfaceReq;

    const prompt = `Design a detailed interface specification:

**Interface Name:** ${interfaceName}
**Type:** ${type || 'REST API'}
**Producer System:** ${producer}
**Consumer System:** ${consumer}
**Data Contract:** ${JSON.stringify(dataContract || {}, null, 2)}

Please provide:

1. **OpenAPI/Swagger Specification:**
\`\`\`yaml
openapi: 3.0.0
info:
  title: ${interfaceName}
  version: 1.0.0
paths:
  /endpoint:
    get:
      summary: Description
      responses:
        '200':
          description: Success
\`\`\`

2. **Request/Response Schemas:**
- Request payload structure
- Response payload structure
- Error response formats

3. **Authentication & Authorization:**
- Auth mechanism (OAuth2, JWT, API Key)
- Required scopes/permissions

4. **Rate Limiting & Quotas:**
- Limits per endpoint
- Throttling policies

5. **Error Handling:**
- Error codes and messages
- Retry policies

6. **Sequence Diagram:**
\`\`\`mermaid
sequenceDiagram
    participant Client
    participant API
    participant Service
    participant Database
    Client->>API: Request
    API->>Service: Process
    Service->>Database: Query
    Database-->>Service: Result
    Service-->>API: Response
    API-->>Client: Response
\`\`\`

Output as structured JSON with embedded specifications.`;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate database schema design
   */
  async generateDatabaseSchema(requirements) {
    const { entities, relationships, databaseType } = requirements;

    const prompt = `Design a database schema for the following requirements:

**Database Type:** ${databaseType || 'PostgreSQL (Relational)'}

**Entities:**
${Array.isArray(entities) ? entities.map((e, i) => `${i + 1}. ${e}`).join('\n') : entities}

**Relationships:**
${Array.isArray(relationships) ? relationships.map((r, i) => `${i + 1}. ${r}`).join('\n') : relationships || 'To be determined'}

Please provide:

1. **Entity Relationship Diagram (Mermaid):**
\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
\`\`\`

2. **Table Definitions:**
For each table:
- Table name
- Columns (name, type, constraints)
- Primary key
- Foreign keys
- Indexes
- Constraints

3. **SQL DDL Scripts:**
\`\`\`sql
CREATE TABLE table_name (
    id UUID PRIMARY KEY,
    column_name TYPE CONSTRAINTS
);
\`\`\`

4. **Data Migration Strategy:**
- Initial data seeding
- Version control approach

5. **Performance Considerations:**
- Indexing strategy
- Partitioning recommendations
- Query optimization tips

Output as JSON with embedded SQL and Mermaid diagrams.`;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate integration architecture
   */
  async generateIntegrationArchitecture(systems) {
    const { internalSystems, externalSystems, integrationPatterns } = systems;

    const prompt = `Design an integration architecture for the following systems:

**Internal Systems:**
${Array.isArray(internalSystems) ? internalSystems.map((s, i) => `${i + 1}. ${s}`).join('\n') : internalSystems}

**External Systems:**
${Array.isArray(externalSystems) ? externalSystems.map((s, i) => `${i + 1}. ${s}`).join('\n') : externalSystems || 'None'}

**Preferred Integration Patterns:**
${Array.isArray(integrationPatterns) ? integrationPatterns.join(', ') : integrationPatterns || 'REST, Message Queue'}

Please provide:

1. **Integration Architecture Diagram:**
\`\`\`mermaid
graph LR
    subgraph Internal
        A[System A]
        B[System B]
    end
    subgraph Integration Layer
        ESB[Integration Hub]
        MQ[Message Queue]
    end
    subgraph External
        EXT1[External API]
    end
    A --> ESB
    B --> ESB
    ESB --> MQ
    ESB --> EXT1
\`\`\`

2. **Interface Matrix:**
| Source | Target | Protocol | Pattern | Data Format |
|--------|--------|----------|---------|-------------|
| A      | B      | REST     | Sync    | JSON        |

3. **Integration Patterns Used:**
- Pattern name
- When to use
- Implementation details

4. **Error Handling & Resilience:**
- Circuit breaker patterns
- Retry policies
- Dead letter queues

5. **Monitoring & Observability:**
- Logging strategy
- Metrics to collect
- Alerting rules

Output as JSON with integration specifications.`;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate C4 model diagrams
   */
  async generateC4Model(system) {
    const prompt = `Create C4 model diagrams for: ${system.name}

**System Description:** ${system.description}
**Users:** ${Array.isArray(system.users) ? system.users.join(', ') : system.users}
**External Systems:** ${Array.isArray(system.externalSystems) ? system.externalSystems.join(', ') : system.externalSystems}

Generate all 4 levels of C4 model:

1. **Level 1 - System Context:**
\`\`\`mermaid
C4Context
    title System Context Diagram
    Person(user, "User")
    System(system, "System Name")
    System_Ext(ext, "External System")
    Rel(user, system, "Uses")
    Rel(system, ext, "Calls")
\`\`\`

2. **Level 2 - Container Diagram:**
Shows the high-level shape of the software architecture

3. **Level 3 - Component Diagram:**
Shows components within containers

4. **Level 4 - Code Diagram:**
Class/entity level details (optional, for complex components)

Provide Mermaid diagrams for each level with explanations.`;

    return this.process(prompt);
  }
}

export default ArchitectureAgent;
