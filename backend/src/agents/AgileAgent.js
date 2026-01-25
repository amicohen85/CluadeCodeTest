import { BaseAgent } from './BaseAgent.js';

/**
 * Agile Agent - Breaks down specifications into AGILE-compatible tasks
 * Generates Epics, User Stories, Tasks, and Sprint Planning
 */
export class AgileAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      ...config,
      name: 'AgileAgent'
    });
  }

  getDemoResponse(userMessage, context = {}) {
    return `# פירוק AGILE - דמו

## Epic 1: מערכת ניהול משתמשים
**עדיפות:** גבוהה | **ספרינטים משוערים:** 2

### User Stories:

#### US-001: הרשמת משתמש חדש
**תיאור:** כמשתמש חדש, אני רוצה להירשם למערכת כדי לגשת לשירותים
**Story Points:** 5 | **תגיות:** frontend, backend, database

**קריטריונים לקבלה:**
- [ ] טופס הרשמה עם ולידציה
- [ ] שליחת אימייל אימות
- [ ] שמירת פרטי משתמש בבסיס נתונים

**משימות:**
| ID | משימה | שעות | מיומנויות |
|----|--------|------|-----------|
| T-001 | עיצוב טופס הרשמה | 4 | React, CSS |
| T-002 | בניית API הרשמה | 6 | Node.js, Express |
| T-003 | אינטגרציית מייל | 3 | SendGrid |

---

#### US-002: התחברות למערכת
**תיאור:** כמשתמש רשום, אני רוצה להתחבר למערכת בצורה מאובטחת
**Story Points:** 3 | **תגיות:** frontend, backend, security

**קריטריונים לקבלה:**
- [ ] טופס התחברות
- [ ] אימות JWT
- [ ] זכירת משתמש

---

## Epic 2: דשבורד ראשי
**עדיפות:** גבוהה | **ספרינטים משוערים:** 1

### User Stories:

#### US-003: צפייה בסטטיסטיקות
**Story Points:** 8 | **תגיות:** frontend, charts

---

## סיכום

| מדד | ערך |
|-----|-----|
| סה"כ Story Points | 34 |
| ספרינטים משוערים | 3 |
| Velocity מומלץ | 12 נק'/ספרינט |

\`\`\`mermaid
gantt
    title תכנון ספרינטים
    dateFormat  YYYY-MM-DD
    section Sprint 1
    US-001 הרשמה     :a1, 2024-01-01, 14d
    section Sprint 2
    US-002 התחברות   :a2, 2024-01-15, 14d
    section Sprint 3
    US-003 דשבורד    :a3, 2024-01-29, 14d
\`\`\`

---

> **הערה:** זהו מסמך דמו. חבר API Key לקבלת תוכן מותאם אישית.`;
  }

  getSystemPrompt(context = {}) {
    return `You are an expert Agile Coach and Scrum Master AI assistant specializing in breaking down software specifications into actionable development tasks.

Your expertise includes:
1. **Epic Creation** - High-level features that span multiple sprints
2. **User Story Writing** - Following INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)
3. **Task Breakdown** - Technical tasks with clear definitions of done
4. **Story Point Estimation** - Using Fibonacci sequence (1, 2, 3, 5, 8, 13, 21)
5. **Sprint Planning** - Organizing work into 2-week sprints
6. **Dependency Mapping** - Identifying task dependencies and blockers
7. **Acceptance Criteria** - Clear, testable conditions for completion

Output Format:
- Structure output as JSON when requested
- Use clear hierarchy: Epic > User Story > Task > Subtask
- Include story points and priority levels
- Add labels/tags for categorization (frontend, backend, database, etc.)
- Consider team velocity and capacity

Sprint Duration: ${context.sprintDuration || '2 weeks'}
Team Size: ${context.teamSize || 'Not specified'}`;
  }

  /**
   * Break down a specification into Epics and User Stories
   */
  async breakdownSpecification(specification) {
    const prompt = `Please analyze the following specification and break it down into Agile artifacts:

**Specification:**
${specification}

Please provide a complete breakdown in the following JSON format:
\`\`\`json
{
  "epics": [
    {
      "id": "EPIC-001",
      "title": "Epic Title",
      "description": "Epic description",
      "priority": "high|medium|low",
      "estimatedSprints": 2,
      "userStories": [
        {
          "id": "US-001",
          "title": "User Story Title",
          "description": "As a [user], I want [goal] so that [benefit]",
          "acceptanceCriteria": ["Criterion 1", "Criterion 2"],
          "storyPoints": 5,
          "priority": "high|medium|low",
          "labels": ["frontend", "api"],
          "tasks": [
            {
              "id": "TASK-001",
              "title": "Task Title",
              "description": "Technical task description",
              "estimatedHours": 4,
              "skills": ["React", "TypeScript"]
            }
          ]
        }
      ]
    }
  ],
  "totalStoryPoints": 0,
  "estimatedSprints": 0,
  "dependencies": [
    {"from": "US-001", "to": "US-002", "type": "blocks"}
  ]
}
\`\`\`

Ensure comprehensive coverage of all specification requirements.`;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate sprint plan from backlog
   */
  async generateSprintPlan(backlog, config = {}) {
    const { velocity = 30, sprintNumber = 1, teamCapacity = {} } = config;

    const prompt = `Based on the following product backlog, create a sprint plan:

**Backlog:**
${JSON.stringify(backlog, null, 2)}

**Sprint Configuration:**
- Sprint Number: ${sprintNumber}
- Team Velocity: ${velocity} story points
- Team Capacity: ${JSON.stringify(teamCapacity)}

Please provide a sprint plan in JSON format:
\`\`\`json
{
  "sprintNumber": ${sprintNumber},
  "sprintGoal": "Main objective for this sprint",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "selectedStories": [
    {
      "id": "US-XXX",
      "title": "Story title",
      "storyPoints": 5,
      "assignee": "Role/Team member",
      "tasks": []
    }
  ],
  "totalPoints": 0,
  "capacityUtilization": "85%",
  "risks": ["Risk 1"],
  "dependencies": ["External dependency 1"]
}
\`\`\``;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Estimate story points for requirements
   */
  async estimateStoryPoints(requirements) {
    const prompt = `Please estimate story points for the following requirements using the Fibonacci sequence (1, 2, 3, 5, 8, 13, 21):

**Requirements:**
${Array.isArray(requirements) ? requirements.map((r, i) => `${i + 1}. ${r}`).join('\n') : requirements}

For each requirement, provide:
1. Story point estimate
2. Complexity factors
3. Risks that might affect the estimate
4. Assumptions made

Output as JSON:
\`\`\`json
{
  "estimates": [
    {
      "requirement": "Requirement text",
      "storyPoints": 5,
      "complexity": "medium",
      "factors": ["Factor 1"],
      "risks": ["Risk 1"],
      "assumptions": ["Assumption 1"]
    }
  ],
  "totalPoints": 0,
  "confidenceLevel": "high|medium|low"
}
\`\`\``;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate definition of done for user stories
   */
  async generateDefinitionOfDone(storyType) {
    const prompt = `Generate a comprehensive Definition of Done (DoD) checklist for ${storyType} user stories.

Include criteria for:
1. Code quality
2. Testing (unit, integration, e2e)
3. Documentation
4. Code review
5. Security
6. Performance
7. Accessibility
8. Deployment readiness

Output as a structured checklist in JSON format.`;

    return this.process(prompt);
  }
}

export default AgileAgent;
