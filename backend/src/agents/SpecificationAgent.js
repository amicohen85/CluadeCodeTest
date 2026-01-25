import { BaseAgent } from './BaseAgent.js';

/**
 * Specification Agent - Generates comprehensive system specification documents
 * from user requirements and project descriptions
 */
export class SpecificationAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      ...config,
      name: 'SpecificationAgent'
    });
  }

  getDemoResponse(userMessage, context = {}) {
    const projectName = context.projectName || 'מערכת לדוגמה';
    return `# מסמך אפיון - ${projectName}

## 1. תקציר מנהלים
מערכת ${projectName} היא פלטפורמה מתקדמת שנועדה לשפר את תהליכי העבודה הארגוניים.
המערכת תספק ממשק משתמש ידידותי, אינטגרציה עם מערכות קיימות, ויכולות אנליטיקה מתקדמות.

## 2. היקף הפרויקט

### כלול בפרויקט:
- פיתוח ממשק משתמש רספונסיבי
- מערכת ניהול משתמשים והרשאות
- API לאינטגרציה עם מערכות חיצוניות
- דשבורד אנליטי

### לא כלול:
- תחזוקה שוטפת (יסופק בנפרד)
- הדרכות משתמשים

## 3. דרישות פונקציונליות

### 3.1 ניהול משתמשים
| מזהה | דרישה | עדיפות |
|------|-------|--------|
| FR-001 | המערכת תאפשר הרשמה עצמאית | גבוהה |
| FR-002 | המערכת תתמוך באימות דו-שלבי | גבוהה |
| FR-003 | המערכת תאפשר שחזור סיסמה | בינונית |

### 3.2 לוח בקרה
| מזהה | דרישה | עדיפות |
|------|-------|--------|
| FR-004 | הצגת נתונים בזמן אמת | גבוהה |
| FR-005 | ייצוא דוחות ל-PDF/Excel | בינונית |

## 4. דרישות לא-פונקציונליות

### ביצועים
- זמן טעינת דף: פחות מ-2 שניות
- תמיכה ב-1000 משתמשים בו-זמנית

### אבטחה
- הצפנת נתונים ב-SSL/TLS
- עמידה בתקן GDPR

## 5. User Stories

\`\`\`
כמשתמש רשום,
אני רוצה להתחבר למערכת בצורה מאובטחת,
כדי לגשת לנתונים האישיים שלי.
\`\`\`

\`\`\`
כמנהל מערכת,
אני רוצה לראות דוח פעילות משתמשים,
כדי לנטר את השימוש במערכת.
\`\`\`

## 6. ארכיטקטורה מוצעת

\`\`\`mermaid
graph TB
    A[Frontend - React] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[Main Service]
    D --> E[(Database)]
    D --> F[Cache]
\`\`\`

---

> **הערה:** זהו מסמך דמו. חבר API Key לקבלת תוכן מותאם אישית.`;
  }

  getSystemPrompt(context = {}) {
    return `You are an expert System Analyst AI assistant specializing in creating comprehensive software specification documents.

Your role is to analyze user requirements and generate professional, detailed specification documents that include:

1. **Executive Summary** - High-level overview of the system
2. **Project Scope** - Boundaries, inclusions, and exclusions
3. **Functional Requirements** - Detailed features and capabilities
4. **Non-Functional Requirements** - Performance, security, scalability
5. **User Stories** - From different stakeholder perspectives
6. **Use Cases** - Detailed interaction scenarios
7. **Data Requirements** - Entities, relationships, data flow
8. **Integration Points** - External systems and APIs
9. **Constraints & Assumptions** - Technical and business limitations
10. **Acceptance Criteria** - Success metrics and validation

Output Format Instructions:
- Use clear, professional Hebrew or English based on input language
- Structure the document with proper headings and sections
- Include diagrams descriptions where applicable
- Be specific and avoid ambiguity
- Consider edge cases and error scenarios

${context.projectName ? `Project: ${context.projectName}` : ''}
${context.industry ? `Industry: ${context.industry}` : ''}`;
  }

  /**
   * Generate a full specification document
   */
  async generateSpecification(input) {
    const { projectName, description, requirements, stakeholders, constraints } = input;

    const prompt = `Please create a comprehensive specification document for the following project:

**Project Name:** ${projectName}

**Project Description:**
${description}

**Initial Requirements:**
${Array.isArray(requirements) ? requirements.map((r, i) => `${i + 1}. ${r}`).join('\n') : requirements}

**Stakeholders:**
${Array.isArray(stakeholders) ? stakeholders.join(', ') : stakeholders || 'To be determined'}

**Known Constraints:**
${constraints || 'None specified'}

Please generate a complete specification document with all sections mentioned in your instructions.
Format the output as a well-structured document.`;

    const result = await this.process(prompt, { projectName });

    return {
      ...result,
      documentType: 'specification',
      projectName
    };
  }

  /**
   * Generate specific sections of a specification
   */
  async generateSection(sectionType, projectContext) {
    const sectionPrompts = {
      functional: 'Generate detailed functional requirements with acceptance criteria',
      nonFunctional: 'Generate non-functional requirements covering performance, security, scalability, and reliability',
      userStories: 'Generate user stories in the format: As a [user type], I want [goal] so that [benefit]',
      useCases: 'Generate detailed use cases with actors, preconditions, main flow, and alternative flows',
      dataModel: 'Generate data requirements including entities, attributes, and relationships'
    };

    const prompt = `Based on the following project context:
${JSON.stringify(projectContext, null, 2)}

${sectionPrompts[sectionType] || 'Generate relevant specification content'}`;

    return this.process(prompt, projectContext);
  }

  /**
   * Analyze and improve existing specifications
   */
  async analyzeSpecification(existingSpec) {
    const prompt = `Please analyze the following specification document and provide:
1. Gaps and missing information
2. Ambiguities that need clarification
3. Potential risks and concerns
4. Suggestions for improvement
5. Questions for stakeholders

Specification Document:
${existingSpec}`;

    return this.process(prompt);
  }
}

export default SpecificationAgent;
