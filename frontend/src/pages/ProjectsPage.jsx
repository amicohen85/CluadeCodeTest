import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus, Trash2, Edit, Loader2, Calendar } from 'lucide-react';
import { projectsApi } from '../services/api';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    stakeholders: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const stakeholders = formData.stakeholders
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await projectsApi.create({
        ...formData,
        stakeholders
      });

      setFormData({ name: '', description: '', industry: '', stakeholders: '' });
      setShowForm(false);
      loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('האם למחוק את הפרויקט?')) return;

    try {
      await projectsApi.delete(id);
      loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">פרויקטים</h1>
            <p className="text-sm text-gray-500">ניהול הפרויקטים שלך</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          פרויקט חדש
        </button>
      </div>

      {/* New Project Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">יצירת פרויקט חדש</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">שם הפרויקט *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="לדוגמה: מערכת CRM"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">תעשייה</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="לדוגמה: פינטק, בריאות, קמעונאות"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="form-label">תיאור</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="תיאור קצר של הפרויקט..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">בעלי עניין (מופרדים בפסיק)</label>
              <input
                type="text"
                className="form-input"
                placeholder="מנהל מוצר, מפתחים, לקוחות"
                value={formData.stakeholders}
                onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    שומר...
                  </>
                ) : (
                  'צור פרויקט'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="card flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card flex flex-col items-center justify-center h-64 text-gray-400">
          <FolderOpen className="w-12 h-12 mb-4 opacity-50" />
          <p>אין פרויקטים עדיין</p>
          <p className="text-sm">לחץ על "פרויקט חדש" כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    {project.industry && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {project.industry}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-600 mb-3">{project.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(project.createdAt)}
                    </span>
                    {project.stakeholders?.length > 0 && (
                      <span>
                        {project.stakeholders.length} בעלי עניין
                      </span>
                    )}
                    <span>
                      {project.specifications?.length || 0} מסמכי אפיון
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="מחק פרויקט"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
