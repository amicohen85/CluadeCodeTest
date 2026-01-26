import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import { DocumentLearningAgent } from '../agents/DocumentLearningAgent.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const learningAgent = new DocumentLearningAgent();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain', // .txt
      'text/markdown', // .md
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(docx?|txt|md)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('סוג קובץ לא נתמך. השתמש ב-DOCX, DOC, TXT או MD'), false);
    }
  }
});

/**
 * Upload and parse document file
 * POST /api/templates/upload
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'לא הועלה קובץ' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const extension = originalname.split('.').pop().toLowerCase();

    logger.info(`Processing uploaded file: ${originalname} (${mimetype}, ${buffer.length} bytes)`);

    let content = '';

    if (extension === 'docx') {
      // Parse DOCX with mammoth - use extractRawText for reliable text extraction
      try {
        const result = await mammoth.extractRawText({ buffer });
        content = result.value;

        logger.info(`Extracted ${content.length} characters from DOCX`);

        if (result.messages && result.messages.length > 0) {
          logger.warn('Mammoth warnings:', result.messages);
        }
      } catch (mammothError) {
        logger.error('Mammoth extraction failed:', mammothError);
        throw new Error('שגיאה בקריאת קובץ DOCX. ודא שהקובץ תקין.');
      }
    } else if (extension === 'doc') {
      // Old .doc format is not fully supported
      return res.status(400).json({
        error: 'פורמט DOC ישן אינו נתמך',
        message: 'נא לשמור את הקובץ בפורמט DOCX (Word 2007+) ולנסות שוב'
      });
    } else {
      // Plain text files (MD, TXT)
      content = buffer.toString('utf-8');
    }

    // Validate we got actual content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'הקובץ ריק או לא ניתן לקרוא את תוכנו'
      });
    }

    res.json({
      success: true,
      content: content.trim(),
      filename: originalname,
      extension,
      charCount: content.length
    });

  } catch (error) {
    logger.error('Error processing uploaded file:', error);
    res.status(500).json({
      error: 'שגיאה בעיבוד הקובץ',
      message: error.message
    });
  }
});

// In-memory storage for templates (in production, use a database)
const templates = new Map();

/**
 * Analyze an uploaded document
 * POST /api/templates/analyze
 */
router.post('/analyze', async (req, res) => {
  try {
    const { content, documentType, name } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    logger.info(`Analyzing document: ${name || 'unnamed'}`);

    const result = await learningAgent.analyzeDocument(content, documentType || 'specification');

    // Store the analyzed template
    const templateId = `template-${Date.now()}`;
    const template = {
      id: templateId,
      name: name || 'מסמך לדוגמה',
      documentType: documentType || 'specification',
      analysis: result.parsed || result.data,
      originalContent: content,
      createdAt: new Date().toISOString()
    };

    templates.set(templateId, template);

    res.json({
      success: true,
      templateId,
      analysis: result.data,
      parsed: result.parsed,
      metadata: result.metadata
    });
  } catch (error) {
    logger.error('Error analyzing document:', error);
    res.status(500).json({ error: 'Failed to analyze document', message: error.message });
  }
});

/**
 * Get all saved templates
 * GET /api/templates
 */
router.get('/', (req, res) => {
  const templateList = Array.from(templates.values()).map(t => ({
    id: t.id,
    name: t.name,
    documentType: t.documentType,
    createdAt: t.createdAt
  }));

  res.json(templateList);
});

/**
 * Get a specific template
 * GET /api/templates/:id
 */
router.get('/:id', (req, res) => {
  const template = templates.get(req.params.id);

  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  res.json(template);
});

/**
 * Generate document using a template
 * POST /api/templates/:id/generate
 */
router.post('/:id/generate', async (req, res) => {
  try {
    const template = templates.get(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const { projectInfo } = req.body;

    if (!projectInfo) {
      return res.status(400).json({ error: 'Project information is required' });
    }

    logger.info(`Generating document from template: ${template.name}`);

    const result = await learningAgent.generateFromTemplate(template.analysis, projectInfo);

    res.json({
      success: true,
      document: result.data,
      metadata: result.metadata
    });
  } catch (error) {
    logger.error('Error generating from template:', error);
    res.status(500).json({ error: 'Failed to generate document', message: error.message });
  }
});

/**
 * Delete a template
 * DELETE /api/templates/:id
 */
router.delete('/:id', (req, res) => {
  if (!templates.has(req.params.id)) {
    return res.status(404).json({ error: 'Template not found' });
  }

  templates.delete(req.params.id);
  res.json({ success: true });
});

/**
 * Compare document with template
 * POST /api/templates/:id/compare
 */
router.post('/:id/compare', async (req, res) => {
  try {
    const template = templates.get(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const { document } = req.body;

    if (!document) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    logger.info(`Comparing document with template: ${template.name}`);

    const result = await learningAgent.suggestImprovements(document, template.analysis);

    res.json({
      success: true,
      suggestions: result.data,
      metadata: result.metadata
    });
  } catch (error) {
    logger.error('Error comparing document:', error);
    res.status(500).json({ error: 'Failed to compare document', message: error.message });
  }
});

export default router;
