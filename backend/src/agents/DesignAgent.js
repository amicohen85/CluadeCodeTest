import { BaseAgent } from './BaseAgent.js';

/**
 * Design Agent - Generates UI/UX screen designs and wireframe specifications
 * Creates detailed screen layouts, component specifications, and user flows
 */
export class DesignAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      ...config,
      name: 'DesignAgent'
    });
  }

  getDemoResponse(userMessage, context = {}) {
    return `# עיצוב מסכים - דמו

## מסך: דף הבית / Dashboard

### Layout Structure
\`\`\`
+--------------------------------------------------+
|  HEADER                                          |
|  [Logo]     [Search...]     [Bell] [User Menu]   |
+--------------------------------------------------+
|  SIDEBAR  |  MAIN CONTENT                        |
|           |                                       |
|  [Home]   |  +-------------+ +-------------+     |
|  [Users]  |  | Card 1      | | Card 2      |     |
|  [Reports]|  | KPI: 1,234  | | KPI: 567    |     |
|  [Settings]| +-------------+ +-------------+     |
|           |                                       |
|           |  +--------------------------------+  |
|           |  | Chart Area                     |  |
|           |  |   [Bar Chart / Line Graph]     |  |
|           |  +--------------------------------+  |
|           |                                       |
+--------------------------------------------------+
|  FOOTER - © 2024 Company                         |
+--------------------------------------------------+
\`\`\`

---

## Component Specifications

### 1. Header Component
| Property | Value |
|----------|-------|
| Height | 64px |
| Background | #FFFFFF |
| Shadow | 0 2px 4px rgba(0,0,0,0.1) |
| Position | Fixed top |

### 2. Sidebar Component
| Property | Value |
|----------|-------|
| Width | 240px (desktop), 0px (mobile) |
| Background | #1a1a2e |
| Text Color | #FFFFFF |

### 3. KPI Cards
| State | Style |
|-------|-------|
| Default | bg-white, shadow-md, rounded-lg |
| Hover | shadow-lg, scale(1.02) |
| Loading | Skeleton animation |

---

## User Flow

\`\`\`mermaid
flowchart TD
    A[Login Page] --> B{Auth OK?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Error Message]
    D --> A
    C --> E[View Reports]
    C --> F[Manage Users]
    C --> G[Settings]
\`\`\`

---

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| Desktop (>1024px) | Full sidebar, 3 columns |
| Tablet (768-1024px) | Collapsible sidebar, 2 columns |
| Mobile (<768px) | Hidden sidebar, 1 column |

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #3B82F6 | Buttons, Links |
| Secondary | #6B7280 | Secondary text |
| Success | #10B981 | Success states |
| Error | #EF4444 | Error states |
| Background | #F3F4F6 | Page background |

---

> **הערה:** זהו עיצוב דמו. חבר API Key לקבלת תוכן מותאם אישית.`;
  }

  getSystemPrompt(context = {}) {
    return `You are an expert UI/UX Designer AI assistant specializing in creating detailed screen designs and user interface specifications.

Your expertise includes:
1. **Wireframe Specifications** - Detailed layout descriptions
2. **Component Design** - Reusable UI component specifications
3. **User Flow Diagrams** - Navigation and interaction flows
4. **Responsive Design** - Mobile, tablet, and desktop layouts
5. **Accessibility** - WCAG 2.1 compliance considerations
6. **Design System** - Consistent styling and patterns
7. **Interaction Design** - Micro-interactions and animations
8. **Information Architecture** - Content organization and hierarchy

Output Format:
- Provide detailed textual descriptions of UI elements
- Include positioning and sizing specifications
- Describe component states (default, hover, active, disabled, error)
- Consider accessibility requirements
- Provide Mermaid diagrams for user flows when applicable

Design Style: ${context.designStyle || 'Modern, clean, minimalist'}
Platform: ${context.platform || 'Web (responsive)'}`;
  }

  /**
   * Generate screen designs from requirements
   */
  async generateScreenDesigns(requirements) {
    const { screenName, purpose, features, userType, platform } = requirements;

    const prompt = `Please create a detailed UI/UX design specification for the following screen:

**Screen Name:** ${screenName}
**Purpose:** ${purpose}
**Key Features:** ${Array.isArray(features) ? features.join(', ') : features}
**Target User:** ${userType || 'General user'}
**Platform:** ${platform || 'Web (responsive)'}

Please provide a comprehensive screen specification including:

1. **Layout Structure**
   - Header, main content, sidebar, footer organization
   - Grid system and spacing

2. **Component Breakdown**
   - Each UI component with:
     - Component name and type
     - Position and size
     - Visual properties (colors, typography, shadows)
     - States (default, hover, active, disabled, loading, error)
     - Interactions and behaviors

3. **Responsive Behavior**
   - Desktop (1920px, 1440px, 1280px)
   - Tablet (1024px, 768px)
   - Mobile (375px, 320px)

4. **User Interactions**
   - Click/tap actions
   - Form validations
   - Loading states
   - Success/error feedback

5. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Color contrast
   - Screen reader considerations

Output the specification in JSON format:
\`\`\`json
{
  "screenName": "${screenName}",
  "layout": {
    "type": "grid|flex",
    "columns": 12,
    "sections": []
  },
  "components": [
    {
      "id": "comp-001",
      "type": "component-type",
      "name": "Component Name",
      "position": {"x": 0, "y": 0},
      "size": {"width": "100%", "height": "auto"},
      "props": {},
      "states": {},
      "interactions": []
    }
  ],
  "responsiveBreakpoints": {},
  "accessibility": {}
}
\`\`\``;

    const result = await this.process(prompt, { platform });

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate user flow diagrams
   */
  async generateUserFlow(process) {
    const { processName, steps, actors, startPoint, endPoints } = process;

    const prompt = `Create a detailed user flow diagram for the following process:

**Process Name:** ${processName}
**Main Actor:** ${actors || 'User'}
**Starting Point:** ${startPoint || 'Entry page'}
**End Points:** ${Array.isArray(endPoints) ? endPoints.join(', ') : endPoints || 'Success/Failure'}

**Process Steps:**
${Array.isArray(steps) ? steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : steps}

Please provide:

1. **Mermaid Flow Diagram:**
\`\`\`mermaid
flowchart TD
    A[Start] --> B[Step 1]
    B --> C{Decision}
    C -->|Yes| D[Action]
    C -->|No| E[Alternative]
\`\`\`

2. **Flow Details:**
- Each step with:
  - Step ID
  - Step name
  - Step type (action, decision, input, display)
  - Connected screens
  - Data requirements
  - Possible outcomes

3. **Error Handling Flows:**
- Error scenarios
- Recovery paths
- User feedback

Output in JSON format with embedded Mermaid diagram.`;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate design system components
   */
  async generateDesignSystem(requirements) {
    const { brandColors, typography, componentTypes } = requirements;

    const prompt = `Create a design system specification with the following requirements:

**Brand Colors:** ${brandColors || 'To be defined - suggest modern palette'}
**Typography:** ${typography || 'To be defined - suggest web-safe fonts'}
**Component Types Needed:** ${Array.isArray(componentTypes) ? componentTypes.join(', ') : componentTypes || 'All standard components'}

Please provide a comprehensive design system including:

1. **Color Palette**
   - Primary, secondary, accent colors
   - Semantic colors (success, warning, error, info)
   - Neutral/gray scale
   - Background and surface colors

2. **Typography Scale**
   - Font families (headings, body, code)
   - Size scale (h1-h6, body, small, caption)
   - Line heights and letter spacing
   - Font weights

3. **Spacing System**
   - Base unit
   - Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)

4. **Component Library**
   - Buttons (primary, secondary, outline, ghost)
   - Form inputs (text, select, checkbox, radio, toggle)
   - Cards and containers
   - Navigation components
   - Modals and overlays
   - Tables and lists
   - Feedback components (alerts, toasts, progress)

5. **Effects**
   - Shadows (sm, md, lg, xl)
   - Border radius
   - Transitions and animations

Output as a structured JSON design token system.`;

    const result = await this.process(prompt);

    return {
      ...result,
      parsed: this.parseStructuredOutput(result.data)
    };
  }

  /**
   * Generate wireframe description for a specific feature
   */
  async generateWireframe(feature) {
    const prompt = `Create a detailed wireframe specification for: ${feature.name}

**Feature Description:** ${feature.description}
**User Goals:** ${feature.userGoals || 'Complete the task efficiently'}
**Key Actions:** ${Array.isArray(feature.actions) ? feature.actions.join(', ') : feature.actions}

Provide an ASCII wireframe representation along with component specifications:

Example format:
\`\`\`
+------------------------------------------+
|  HEADER - Logo | Navigation | User Menu  |
+------------------------------------------+
|  SIDEBAR  |     MAIN CONTENT AREA        |
|   - Nav1  |  +------------------------+  |
|   - Nav2  |  |  Card Component        |  |
|   - Nav3  |  |  - Title               |  |
|           |  |  - Content             |  |
|           |  |  - Actions             |  |
|           |  +------------------------+  |
+------------------------------------------+
|  FOOTER - Links | Copyright              |
+------------------------------------------+
\`\`\`

Include detailed specifications for each component.`;

    return this.process(prompt);
  }
}

export default DesignAgent;
