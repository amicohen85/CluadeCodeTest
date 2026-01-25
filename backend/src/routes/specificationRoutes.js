import express from 'express';
import { SpecificationAgent } from '../agents/SpecificationAgent.js';
import { logger } from '../utils/logger.js';
import { projects } from './projectRoutes.js';

const router = express.Router();
const specAgent = new SpecificationAgent();

/**
 * Generate a specification document
 * POST /api/specifications/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { projectId, projectName, description, requirements, stakeholders, constraints } = req.body;

    if (!projectName && !projectId) {
      return res.status(400).json({ error: 'Project name or ID is required' });
    }

    if (!description && !requirements) {
      return res.status(400).json({ error: 'Description or requirements are required' });
    }

    logger.info(`Generating specification for: ${projectName || projectId}`);

    const result = await specAgent.generateSpecification({
      projectName: projectName || projects.get(projectId)?.name,
      description,
      requirements,
      stakeholders,
      constraints
    });

    // If projectId provided, save to project
    if (projectId && projects.has(projectId)) {
      const project = projects.get(projectId);
      project.specifications.push({
        id: Date.now().toString(),
        content: result.data,
        createdAt: new Date().toISOString()
      });
      project.updatedAt = new Date().toISOString();
      projects.set(projectId, project);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error generating specification:', error);
    res.status(500).json({ error: 'Failed to generate specification', message: error.message });
  }
});

/**
 * Generate a specific section of a specification
 * POST /api/specifications/section
 */
router.post('/section', async (req, res) => {
  try {
    const { sectionType, projectContext } = req.body;

    if (!sectionType) {
      return res.status(400).json({ error: 'Section type is required' });
    }

    const validSections = ['functional', 'nonFunctional', 'userStories', 'useCases', 'dataModel'];
    if (!validSections.includes(sectionType)) {
      return res.status(400).json({
        error: `Invalid section type. Valid types: ${validSections.join(', ')}`
      });
    }

    logger.info(`Generating ${sectionType} section`);

    const result = await specAgent.generateSection(sectionType, projectContext);

    res.json(result);
  } catch (error) {
    logger.error('Error generating section:', error);
    res.status(500).json({ error: 'Failed to generate section', message: error.message });
  }
});

/**
 * Analyze an existing specification
 * POST /api/specifications/analyze
 */
router.post('/analyze', async (req, res) => {
  try {
    const { specification } = req.body;

    if (!specification) {
      return res.status(400).json({ error: 'Specification content is required' });
    }

    logger.info('Analyzing specification');

    const result = await specAgent.analyzeSpecification(specification);

    res.json(result);
  } catch (error) {
    logger.error('Error analyzing specification:', error);
    res.status(500).json({ error: 'Failed to analyze specification', message: error.message });
  }
});

export default router;
