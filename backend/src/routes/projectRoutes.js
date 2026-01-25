import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

const router = express.Router();

// In-memory storage (replace with database in production)
const projects = new Map();

/**
 * Create a new project
 * POST /api/projects
 */
router.post('/', (req, res) => {
  try {
    const { name, description, industry, stakeholders } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = {
      id: uuidv4(),
      name,
      description: description || '',
      industry: industry || '',
      stakeholders: stakeholders || [],
      specifications: [],
      agileArtifacts: [],
      designs: [],
      architecture: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.set(project.id, project);
    logger.info(`Project created: ${project.id}`);

    res.status(201).json(project);
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

/**
 * Get all projects
 * GET /api/projects
 */
router.get('/', (req, res) => {
  const projectList = Array.from(projects.values());
  res.json(projectList);
});

/**
 * Get a specific project
 * GET /api/projects/:id
 */
router.get('/:id', (req, res) => {
  const project = projects.get(req.params.id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json(project);
});

/**
 * Update a project
 * PUT /api/projects/:id
 */
router.put('/:id', (req, res) => {
  const project = projects.get(req.params.id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, description, industry, stakeholders } = req.body;

  const updatedProject = {
    ...project,
    name: name || project.name,
    description: description || project.description,
    industry: industry || project.industry,
    stakeholders: stakeholders || project.stakeholders,
    updatedAt: new Date().toISOString()
  };

  projects.set(project.id, updatedProject);
  logger.info(`Project updated: ${project.id}`);

  res.json(updatedProject);
});

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
router.delete('/:id', (req, res) => {
  if (!projects.has(req.params.id)) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects.delete(req.params.id);
  logger.info(`Project deleted: ${req.params.id}`);

  res.status(204).send();
});

// Export projects map for use by other routes
export { projects };
export default router;
