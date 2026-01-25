import express from 'express';
import { AgileAgent } from '../agents/AgileAgent.js';
import { logger } from '../utils/logger.js';
import { projects } from './projectRoutes.js';

const router = express.Router();
const agileAgent = new AgileAgent();

/**
 * Break down specification into AGILE artifacts
 * POST /api/agile/breakdown
 */
router.post('/breakdown', async (req, res) => {
  try {
    const { projectId, specification } = req.body;

    if (!specification) {
      return res.status(400).json({ error: 'Specification is required' });
    }

    logger.info('Breaking down specification into AGILE artifacts');

    const result = await agileAgent.breakdownSpecification(specification);

    // If projectId provided, save to project
    if (projectId && projects.has(projectId)) {
      const project = projects.get(projectId);
      project.agileArtifacts.push({
        id: Date.now().toString(),
        type: 'breakdown',
        content: result.parsed || result.data,
        createdAt: new Date().toISOString()
      });
      project.updatedAt = new Date().toISOString();
      projects.set(projectId, project);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error breaking down specification:', error);
    res.status(500).json({ error: 'Failed to break down specification', message: error.message });
  }
});

/**
 * Generate sprint plan
 * POST /api/agile/sprint-plan
 */
router.post('/sprint-plan', async (req, res) => {
  try {
    const { backlog, velocity, sprintNumber, teamCapacity } = req.body;

    if (!backlog) {
      return res.status(400).json({ error: 'Backlog is required' });
    }

    logger.info(`Generating sprint plan for sprint ${sprintNumber || 1}`);

    const result = await agileAgent.generateSprintPlan(backlog, {
      velocity,
      sprintNumber,
      teamCapacity
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating sprint plan:', error);
    res.status(500).json({ error: 'Failed to generate sprint plan', message: error.message });
  }
});

/**
 * Estimate story points
 * POST /api/agile/estimate
 */
router.post('/estimate', async (req, res) => {
  try {
    const { requirements } = req.body;

    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are required' });
    }

    logger.info('Estimating story points');

    const result = await agileAgent.estimateStoryPoints(requirements);

    res.json(result);
  } catch (error) {
    logger.error('Error estimating story points:', error);
    res.status(500).json({ error: 'Failed to estimate story points', message: error.message });
  }
});

/**
 * Generate Definition of Done
 * POST /api/agile/definition-of-done
 */
router.post('/definition-of-done', async (req, res) => {
  try {
    const { storyType } = req.body;

    logger.info(`Generating Definition of Done for ${storyType || 'general'} stories`);

    const result = await agileAgent.generateDefinitionOfDone(storyType || 'general');

    res.json(result);
  } catch (error) {
    logger.error('Error generating DoD:', error);
    res.status(500).json({ error: 'Failed to generate Definition of Done', message: error.message });
  }
});

export default router;
