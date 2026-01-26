import { BaseAgent } from './BaseAgent.js';

/**
 * Document Learning Agent - Analyzes uploaded sample documents
 * to learn structure, style, and content patterns
 */
export class DocumentLearningAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      ...config,
      name: 'DocumentLearningAgent'
    });
  }

  getDemoResponse(userMessage, context = {}) {
    return `# ניתוח מסמך לדוגמה - דמו

## סיכום המסמך שהועלה

המסמך שהועלה הוא **מסמך אפיון מערכת** המכיל את המבנה הבא:

---

## מבנה פרקים שזוהה

### 📋 פרק 1: תקציר מנהלים
**מטרה:** סקירה כללית ברמה גבוהה
**אורך מומלץ:** 1-2 פסקאות
**תוכן נדרש:**
- תיאור קצר של המערכת
- ערך עסקי
- קהל יעד

---

### 📋 פרק 2: היקף הפרויקט
**מטרה:** הגדרת גבולות הפרויקט
**אורך מומלץ:** 2-3 סעיפים
**תוכן נדרש:**
- מה כלול בפרויקט
- מה לא כלול (Out of Scope)
- הנחות יסוד

---

### 📋 פרק 3: דרישות פונקציונליות
**מטרה:** פירוט יכולות המערכת
**פורמט:** טבלה עם עמודות
| עמודה | תיאור |
|-------|-------|
| מזהה | FR-XXX |
| דרישה | תיאור הדרישה |
| עדיפות | גבוהה/בינונית/נמוכה |
| קריטריונים | תנאי קבלה |

---

### 📋 פרק 4: דרישות לא-פונקציונליות
**מטרה:** ביצועים, אבטחה, סקיילביליות
**קטגוריות שזוהו:**
- ביצועים (Performance)
- אבטחה (Security)
- זמינות (Availability)
- תאימות (Compliance)

---

### 📋 פרק 5: ארכיטקטורה
**מטרה:** תכנון טכני
**תוכן נדרש:**
- תרשים מערכת (Mermaid/Draw.io)
- רשימת רכיבים
- טכנולוגיות מוצעות

---

## סגנון כתיבה שזוהה

| מאפיין | ערך |
|--------|-----|
| שפה | עברית מקצועית |
| טון | פורמלי-עסקי |
| מספור | היררכי (1, 1.1, 1.1.1) |
| טבלאות | כן - לדרישות |
| תרשימים | Mermaid |

---

## המלצות ליצירת מסמך חדש

בהתבסס על המסמך שהועלה, המערכת תיצור מסמכים עם:

1. ✅ אותו מבנה פרקים
2. ✅ אותו פורמט טבלאות
3. ✅ אותו סגנון כתיבה
4. ✅ אותה רמת פירוט
5. ✅ תרשימי Mermaid

---

> **הערה:** זהו ניתוח דמו. חבר API Key לניתוח אמיתי של המסמך שלך.`;
  }

  getSystemPrompt(context = {}) {
    return `You are an expert Document Analyst AI specializing in analyzing document structures, templates, and writing patterns.

Your role is to:
1. **Analyze Document Structure** - Identify chapters, sections, and hierarchy
2. **Extract Patterns** - Learn formatting, numbering, and styling conventions
3. **Identify Content Types** - Tables, lists, diagrams, code blocks
4. **Learn Writing Style** - Tone, terminology, level of detail
5. **Create Templates** - Generate reusable document templates

When analyzing a document, provide:
- Complete chapter/section breakdown
- Required content for each section
- Formatting guidelines
- Sample content patterns
- Recommended length for each section

Language: Respond in Hebrew unless the document is in English.
Output: Provide structured JSON for machine-readable templates.`;
  }

  /**
   * Analyze an uploaded document and extract its structure
   */
  async analyzeDocument(documentContent, documentType = 'specification') {
    const prompt = `Please analyze the following ${documentType} document and extract its complete structure:

**Document Content:**
${documentContent}

Please provide a comprehensive analysis including:

1. **Document Structure:**
   - List all chapters/sections with their hierarchy
   - Purpose of each section
   - Required vs optional sections

2. **Content Patterns:**
   - How requirements are formatted
   - Table structures used
   - Numbering conventions
   - Diagram types

3. **Writing Style:**
   - Language and tone
   - Level of technical detail
   - Terminology patterns

4. **Template Generation:**
   Create a reusable template based on this document.

Output as JSON:
\`\`\`json
{
  "documentType": "${documentType}",
  "structure": {
    "chapters": [
      {
        "number": "1",
        "title": "Chapter Title",
        "purpose": "What this chapter contains",
        "requiredContent": ["item1", "item2"],
        "format": "prose|table|list|diagram",
        "estimatedLength": "short|medium|long",
        "subSections": []
      }
    ]
  },
  "patterns": {
    "requirementFormat": "ID | Description | Priority",
    "numberingStyle": "1, 1.1, 1.1.1",
    "tableUsage": ["requirements", "specifications"],
    "diagramTypes": ["flowchart", "erd", "sequence"]
  },
  "style": {
    "language": "hebrew|english",
    "tone": "formal|semi-formal|technical",
    "detailLevel": "high|medium|low"
  },
  "template": "Markdown template string..."
}
\`\`\``;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate a new document based on learned patterns
   */
  async generateFromTemplate(template, projectInfo) {
    const prompt = `Using the following document template and patterns:

**Template:**
${JSON.stringify(template, null, 2)}

**Project Information:**
${JSON.stringify(projectInfo, null, 2)}

Generate a complete document following the exact structure, style, and formatting of the template.
Each section should have real, relevant content for the given project.
Maintain the same level of detail and professionalism as the original template.`;

    return this.process(prompt);
  }

  /**
   * Compare two documents and identify differences
   */
  async compareDocuments(doc1, doc2) {
    const prompt = `Compare the following two documents and identify:
1. Structural differences
2. Missing sections
3. Style inconsistencies
4. Content gaps

**Document 1:**
${doc1}

**Document 2:**
${doc2}

Provide a detailed comparison report.`;

    return this.process(prompt);
  }

  /**
   * Suggest improvements based on template
   */
  async suggestImprovements(document, template) {
    const prompt = `Based on the following template/standard:

**Template:**
${JSON.stringify(template, null, 2)}

Analyze this document and suggest improvements:

**Document:**
${document}

Provide specific recommendations for:
1. Missing sections that should be added
2. Sections that need more detail
3. Formatting improvements
4. Content enhancements`;

    return this.process(prompt);
  }
}

export default DocumentLearningAgent;
