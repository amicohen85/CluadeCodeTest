import express from 'express';
import { ArchitectureAgent } from '../agents/ArchitectureAgent.js';
import { logger } from '../utils/logger.js';
import { projects } from './projectRoutes.js';

const router = express.Router();
const archAgent = new ArchitectureAgent();

/**
 * Generate system architecture
 * POST /api/architecture/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { projectId, systemName, description, components, integrations, requirements } = req.body;

    if (!systemName || !description) {
      return res.status(400).json({ error: 'System name and description are required' });
    }

    logger.info(`Generating architecture for: ${systemName}`);

    const result = await archAgent.generateArchitecture({
      systemName,
      description,
      components,
      integrations,
      requirements
    });

    // If projectId provided, save to project
    if (projectId && projects.has(projectId)) {
      const project = projects.get(projectId);
      project.architecture = {
        id: Date.now().toString(),
        content: result.parsed || result.data,
        createdAt: new Date().toISOString()
      };
      project.updatedAt = new Date().toISOString();
      projects.set(projectId, project);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error generating architecture:', error);
    res.status(500).json({ error: 'Failed to generate architecture', message: error.message });
  }
});

/**
 * Generate interface/API specifications
 * POST /api/architecture/interface
 */
router.post('/interface', async (req, res) => {
  try {
    const { interfaceName, type, producer, consumer, dataContract } = req.body;

    if (!interfaceName || !producer || !consumer) {
      return res.status(400).json({
        error: 'Interface name, producer, and consumer are required'
      });
    }

    logger.info(`Generating interface spec for: ${interfaceName}`);

    const result = await archAgent.generateInterfaceSpec({
      interfaceName,
      type,
      producer,
      consumer,
      dataContract
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating interface spec:', error);
    res.status(500).json({ error: 'Failed to generate interface specification', message: error.message });
  }
});

/**
 * Generate database schema
 * POST /api/architecture/database
 */
router.post('/database', async (req, res) => {
  try {
    const { entities, relationships, databaseType } = req.body;

    if (!entities) {
      return res.status(400).json({ error: 'Entities are required' });
    }

    logger.info('Generating database schema');

    const result = await archAgent.generateDatabaseSchema({
      entities,
      relationships,
      databaseType
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating database schema:', error);
    res.status(500).json({ error: 'Failed to generate database schema', message: error.message });
  }
});

/**
 * Generate integration architecture
 * POST /api/architecture/integration
 */
router.post('/integration', async (req, res) => {
  try {
    const { internalSystems, externalSystems, integrationPatterns } = req.body;

    if (!internalSystems) {
      return res.status(400).json({ error: 'Internal systems list is required' });
    }

    logger.info('Generating integration architecture');

    const result = await archAgent.generateIntegrationArchitecture({
      internalSystems,
      externalSystems,
      integrationPatterns
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating integration architecture:', error);
    res.status(500).json({ error: 'Failed to generate integration architecture', message: error.message });
  }
});

/**
 * Generate C4 model diagrams
 * POST /api/architecture/c4-model
 */
router.post('/c4-model', async (req, res) => {
  try {
    const { name, description, users, externalSystems } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'System name and description are required' });
    }

    logger.info(`Generating C4 model for: ${name}`);

    const result = await archAgent.generateC4Model({
      name,
      description,
      users,
      externalSystems
    });

    res.json(result);
  } catch (error) {
    logger.error('Error generating C4 model:', error);
    res.status(500).json({ error: 'Failed to generate C4 model', message: error.message });
  }
});

export default router;
