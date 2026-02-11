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

  /**
   * Check if a line looks like a heading (for DOCX documents without clear markdown)
   */
  isLikelyHeading(line, nextLine = '') {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 100) return { isHeading: false };

    // Hebrew heading keywords
    const hebrewHeadingPatterns = [
      /^(פרק|סעיף|נספח|תקציר|מבוא|רקע|מטרות|היקף|דרישות|ארכיטקטורה|עיצוב|בדיקות|סיכום|הגדרות|מונחים|תוכן עניינים|הקדמה|סקירה|ניתוח|תכנון|יישום|תחזוקה|אבטחה|ביצועים|ממשקים|נתונים|תהליכים|משתמשים|הרשאות|גיבוי|שחזור)/i,
      /^(functional|non-functional|requirements|architecture|design|testing|summary|introduction|scope|objectives|background|overview|analysis|implementation|security|performance|interfaces|data|processes|users)/i
    ];

    // Check Hebrew heading patterns
    for (const pattern of hebrewHeadingPatterns) {
      if (pattern.test(trimmed)) {
        return { isHeading: true, level: 1, title: trimmed };
      }
    }

    // Check if line ends with colon (common heading pattern in Hebrew docs)
    if (trimmed.endsWith(':') && trimmed.length < 60) {
      return { isHeading: true, level: 2, title: trimmed.slice(0, -1) };
    }

    // Short line followed by longer line (potential heading)
    if (trimmed.length < 50 && nextLine && nextLine.trim().length > trimmed.length * 2) {
      // Check it's not a list item
      if (!trimmed.match(/^[-*•\d.)\]]/)) {
        return { isHeading: true, level: 2, title: trimmed };
      }
    }

    return { isHeading: false };
  }

  /**
   * Local analysis without AI - analyzes document structure AND extracts content
   * Enhanced to detect headings in DOCX documents
   */
  analyzeDocumentLocally(content) {
    const lines = content.split('\n');
    const chapters = [];
    const patterns = {
      requirementFormat: '',
      numberingStyle: '',
      tableUsage: [],
      diagramTypes: []
    };

    let currentChapter = null;
    let currentSubSection = null;
    let tableCount = 0;
    let listCount = 0;
    let hasNumberedHeadings = false;
    let contentBeforeFirstChapter = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const nextLine = lines[i + 1] || '';

      if (!trimmedLine) {
        // Add empty line to content if we have a current section
        if (currentSubSection && currentSubSection.content) {
          currentSubSection.content += '\n';
        } else if (currentChapter && currentChapter.content) {
          currentChapter.content += '\n';
        } else if (!currentChapter) {
          contentBeforeFirstChapter += '\n';
        }
        continue;
      }

      // Detect markdown headings
      const mdHeadingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (mdHeadingMatch) {
        const level = mdHeadingMatch[1].length;
        const title = mdHeadingMatch[2];
        if (level <= 2) {
          currentSubSection = null;
          currentChapter = {
            number: String(chapters.length + 1),
            title: title,
            purpose: `פרק ${title}`,
            requiredContent: [],
            format: 'prose',
            estimatedLength: 'medium',
            subSections: [],
            content: ''
          };
          chapters.push(currentChapter);
        } else if (currentChapter) {
          currentSubSection = {
            title: title,
            level: level,
            content: ''
          };
          currentChapter.subSections.push(currentSubSection);
        }
        continue;
      }

      // Detect numbered headings (1. Title, 1.1 Title, etc.)
      const numberedMatch = trimmedLine.match(/^(\d+(?:\.\d+)*)[.\s]+(.+)$/);
      if (numberedMatch && numberedMatch[2].length < 100) {
        hasNumberedHeadings = true;
        const num = numberedMatch[1];
        const title = numberedMatch[2];
        const depth = num.split('.').length;

        if (depth === 1) {
          currentSubSection = null;
          currentChapter = {
            number: num,
            title: title,
            purpose: `פרק ${num}: ${title}`,
            requiredContent: [],
            format: 'prose',
            estimatedLength: 'medium',
            subSections: [],
            content: ''
          };
          chapters.push(currentChapter);
        } else if (currentChapter) {
          currentSubSection = {
            number: num,
            title: title,
            level: depth,
            content: ''
          };
          currentChapter.subSections.push(currentSubSection);
        }
        continue;
      }

      // Check for likely headings (DOCX pattern detection)
      const headingCheck = this.isLikelyHeading(trimmedLine, nextLine);
      if (headingCheck.isHeading) {
        if (headingCheck.level === 1) {
          currentSubSection = null;
          currentChapter = {
            number: String(chapters.length + 1),
            title: headingCheck.title,
            purpose: headingCheck.title,
            requiredContent: [],
            format: 'prose',
            estimatedLength: 'medium',
            subSections: [],
            content: ''
          };
          chapters.push(currentChapter);
        } else if (currentChapter) {
          currentSubSection = {
            title: headingCheck.title,
            level: headingCheck.level,
            content: ''
          };
          currentChapter.subSections.push(currentSubSection);
        }
        continue;
      }

      // Add content to current section
      if (currentSubSection) {
        currentSubSection.content += trimmedLine + '\n';
      } else if (currentChapter) {
        currentChapter.content += trimmedLine + '\n';
      } else {
        contentBeforeFirstChapter += trimmedLine + '\n';
      }

      // Detect tables
      if (trimmedLine.includes('|') && trimmedLine.split('|').length >= 3) {
        tableCount++;
        if (currentChapter) {
          currentChapter.format = 'table';
          if (!patterns.tableUsage.includes(currentChapter.title)) {
            patterns.tableUsage.push(currentChapter.title);
          }
        }
      }

      // Detect lists
      if (trimmedLine.match(/^[-*•]\s+/) || trimmedLine.match(/^\d+[.)]\s+/)) {
        listCount++;
        if (currentChapter && currentChapter.format === 'prose') {
          currentChapter.format = 'list';
        }
      }

      // Detect requirement IDs
      const reqMatch = trimmedLine.match(/\b(REQ|FR|NFR|BR|SR|UC)-?\d+/i);
      if (reqMatch && !patterns.requirementFormat) {
        patterns.requirementFormat = reqMatch[0].replace(/\d+/, 'XXX');
      }
    }

    // If content exists before first chapter, add it as intro
    if (contentBeforeFirstChapter.trim() && chapters.length > 0) {
      chapters.unshift({
        number: '0',
        title: 'פתיח / מידע כללי',
        content: contentBeforeFirstChapter.trim(),
        format: 'prose',
        subSections: []
      });
    }

    // If no chapters were detected, create one with all content
    if (chapters.length === 0) {
      chapters.push({
        number: '1',
        title: 'תוכן המסמך',
        content: content,
        format: 'prose',
        subSections: []
      });
    }

    patterns.numberingStyle = hasNumberedHeadings ? '1, 1.1, 1.1.1' : 'זיהוי אוטומטי';

    // Detect language
    const hebrewChars = (content.match(/[\u0590-\u05FF]/g) || []).length;
    const englishChars = (content.match(/[a-zA-Z]/g) || []).length;
    const language = hebrewChars > englishChars ? 'hebrew' : 'english';

    // Build analysis result
    const analysis = {
      documentType: 'specification',
      structure: { chapters },
      patterns,
      style: {
        language,
        tone: 'formal',
        detailLevel: chapters.length > 5 ? 'high' : 'medium'
      },
      stats: {
        totalChapters: chapters.length,
        totalSubSections: chapters.reduce((sum, ch) => sum + (ch.subSections?.length || 0), 0),
        tableCount,
        listCount,
        wordCount: content.split(/\s+/).length
      },
      originalContent: content
    };

    return analysis;
  }

  /**
   * Format local analysis as readable markdown - shows FULL content organized by sections
   */
  formatLocalAnalysis(analysis) {
    let md = `# 📄 תוכן האפיון המאורגן\n\n`;

    // Summary box
    md += `> **סיכום:** ${analysis.stats.totalChapters} פרקים | ${analysis.stats.totalSubSections} תתי-סעיפים | ${analysis.stats.wordCount} מילים\n\n`;
    md += `---\n\n`;

    // Display each chapter with its FULL content
    for (const chapter of analysis.structure.chapters) {
      // Chapter header
      md += `## 📋 ${chapter.number}. ${chapter.title}\n\n`;

      // Chapter content
      if (chapter.content && chapter.content.trim()) {
        md += chapter.content.trim() + '\n\n';
      }

      // Sub-sections with their content
      if (chapter.subSections && chapter.subSections.length > 0) {
        for (const sub of chapter.subSections) {
          const subNumber = sub.number || '';
          md += `### ${subNumber} ${sub.title}\n\n`;

          if (sub.content && sub.content.trim()) {
            md += sub.content.trim() + '\n\n';
          }
        }
      }

      md += `---\n\n`;
    }

    // Footer with stats
    md += `\n## 📊 סיכום מבנה המסמך\n\n`;
    md += `| מאפיין | ערך |\n|--------|-----|\n`;
    md += `| שפה | ${analysis.style.language === 'hebrew' ? 'עברית' : 'אנגלית'} |\n`;
    md += `| סגנון מספור | ${analysis.patterns.numberingStyle} |\n`;
    md += `| רמת פירוט | ${analysis.style.detailLevel === 'high' ? 'גבוהה' : 'בינונית'} |\n`;
    md += `| פרקים | ${analysis.stats.totalChapters} |\n`;
    md += `| תתי-סעיפים | ${analysis.stats.totalSubSections} |\n`;

    if (analysis.patterns.requirementFormat) {
      md += `| פורמט דרישות | ${analysis.patterns.requirementFormat} |\n`;
    }

    return md;
  }

  getDemoResponse(userMessage, context = {}) {
    // If we have actual content, do local analysis
    if (context.documentContent) {
      const analysis = this.analyzeDocumentLocally(context.documentContent);
      return this.formatLocalAnalysis(analysis);
    }

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

    const result = await this.process(prompt, { documentContent });

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
