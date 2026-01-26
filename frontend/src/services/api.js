import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Projects API
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
};

// Specification API
export const specificationApi = {
  generate: (data) => api.post('/specifications/generate', data),
  generateSection: (data) => api.post('/specifications/section', data),
  analyze: (data) => api.post('/specifications/analyze', data)
};

// Agile API
export const agileApi = {
  breakdown: (data) => api.post('/agile/breakdown', data),
  sprintPlan: (data) => api.post('/agile/sprint-plan', data),
  estimate: (data) => api.post('/agile/estimate', data),
  definitionOfDone: (data) => api.post('/agile/definition-of-done', data)
};

// Design API
export const designApi = {
  generateScreens: (data) => api.post('/design/screens', data),
  generateUserFlow: (data) => api.post('/design/user-flow', data),
  generateDesignSystem: (data) => api.post('/design/design-system', data),
  generateWireframe: (data) => api.post('/design/wireframe', data)
};

// Architecture API
export const architectureApi = {
  generate: (data) => api.post('/architecture/generate', data),
  generateInterface: (data) => api.post('/architecture/interface', data),
  generateDatabase: (data) => api.post('/architecture/database', data),
  generateIntegration: (data) => api.post('/architecture/integration', data),
  generateC4Model: (data) => api.post('/architecture/c4-model', data)
};

// Templates API - Document Learning
export const templatesApi = {
  analyze: (data) => api.post('/templates/analyze', data),
  getAll: () => api.get('/templates'),
  getById: (id) => api.get(`/templates/${id}`),
  generateFromTemplate: (id, data) => api.post(`/templates/${id}/generate`, data),
  compare: (id, data) => api.post(`/templates/${id}/compare`, data),
  delete: (id) => api.delete(`/templates/${id}`),
  // File upload with progress tracking
  uploadFile: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/templates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });
  }
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
