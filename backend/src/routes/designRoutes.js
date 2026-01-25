import express from 'express';
import { DesignAgent } from '../agents/DesignAgent.js';
import { logger } from '../utils/logger.js';
import { projects } from './projectRoutes.js';

const router = express.Router();
const designAgent = new DesignAgent();

/**
 * Generate screen design specifications
 * POST /api/design/screens
 */
router.post('/screens', async (req, res) => {
  try {
    const { projectId, screenName, purpose, features, userType, platform } = req.body;

    if (!screenName || !purpose) {
      return res.status(400).json({ error: 'Screen name and purpose are required' });
    }

    logger.info(`Generating screen design for: ${screenName}`);

    const result = await designAgent.generateScreenDesigns({
      screenName,
      purpose,
      features,
      userType,
      platform
    });

    // If projectId provided, save to project
    if (projectId && projects.has(projectId)) {
      const project = projects.get(projectId);
      project.designs.push({
        id: Date.now().toString(),
        type: 'screen',
        name: screenName,
        content: result.parsed || result.data,
        createdAt: new Date().toISOString()
      });
      project.updatedAt = new Date().toISOString();
      projects.set(projectId, project);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error generating screen design:', error);
    res.status(500).json({ error: 'Failed to generate screen design', message: error.message });
  }
});

/**
 * Generate user flow diagrams
 * POST /api/design/user-flow
 */
router.post('/user-flow', async (req, res) => {
  try {
    const { processName, steps, actors, startPoint, endPoints } = req.body;

    if (!processName || !steps) {
      return res.status(400).json({ error: 'Process name and steps are required' });
    }

    logger.info(`Generating user flow for: ${processName}`);

    const result = await designAgent.generateUserFlow({
      processName,
      steps,
      actors,
      startPoint,
      endPoints
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating user flow:', error);
    res.status(500).json({ error: 'Failed to generate user flow', message: error.message });
  }
});

/**
 * Generate design system
 * POST /api/design/design-system
 */
router.post('/design-system', async (req, res) => {
  try {
    const { brandColors, typography, componentTypes } = req.body;

    logger.info('Generating design system');

    const result = await designAgent.generateDesignSystem({
      brandColors,
      typography,
      componentTypes
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating design system:', error);
    res.status(500).json({ error: 'Failed to generate design system', message: error.message });
  }
});

/**
 * Generate wireframe specifications
 * POST /api/design/wireframe
 */
router.post('/wireframe', async (req, res) => {
  try {
    const { name, description, userGoals, actions } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Feature name and description are required' });
    }

    logger.info(`Generating wireframe for: ${name}`);

    const result = await designAgent.generateWireframe({
      name,
      description,
      userGoals,
      actions
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating wireframe:', error);
    res.status(500).json({ error: 'Failed to generate wireframe', message: error.message });
  }
});

export default router;
