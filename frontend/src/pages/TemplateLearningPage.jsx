import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Upload,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  FileWarning,
  File
} from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { templatesApi } from '../services/api';

function TemplateLearningPage() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadedContent, setUploadedContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('specification');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [expandedSections, setExpandedSections] = useState({});
  const fileInputRef = useRef(null);

  // Project info for generation
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    description: '',
    requirements: ''
  });
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await templatesApi.getAll();
      setTemplates(response.data);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadProgress(0);
    setError(null);
    setUploadedFileName(file.name);
    setDocumentName(file.name.replace(/\.[^/.]+$/, ''));

    try {
      // Upload to backend for processing
      const response = await templatesApi.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.data.success) {
        setUploadedContent(response.data.content);
        setUploadProgress(100);
      } else {
        setError('שגיאה בעיבוד הקובץ');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'שגיאה בהעלאת הקובץ. נסה שוב.');
    } finally {
      setUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedContent.trim()) {
      setError('נא להעלות או להדביק מסמך לניתוח');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await templatesApi.analyze({
        content: uploadedContent,
        documentType,
        name: documentName || 'מסמך לדוגמה'
      });

      setAnalysisResult(response.data);
      loadTemplates(); // Refresh templates list
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בניתוח המסמך');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      setError('נא לבחור תבנית');
      return;
    }

    if (!projectInfo.projectName || !projectInfo.description) {
      setError('נא למלא שם פרויקט ותיאור');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await templatesApi.generateFromTemplate(selectedTemplate.id, {
        projectInfo
      });

      setGeneratedDocument(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ביצירת המסמך');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('למחוק את התבנית?')) return;

    try {
      await templatesApi.delete(id);
      loadTemplates();
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    } catch (err) {
      console.error('Failed to delete template:', err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadDocument = () => {
    if (!generatedDocument?.document) return;

    const blob = new Blob([generatedDocument.document], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectInfo.projectName || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">למידה מתבניות</h1>
            <p className="text-gray-500">העלה מסמך לדוגמה והמערכת תלמד ממנו</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-violet-100 text-violet-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          העלאת מסמך
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-violet-100 text-violet-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          התבניות שלי ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'generate'
              ? 'bg-violet-100 text-violet-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          יצירה מתבנית
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-violet-600" />
              העלאת מסמך לדוגמה
            </h2>

            <div className="space-y-4">
              {/* File Upload */}
              <div
                onClick={() => !uploadingFile && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  uploadingFile
                    ? 'border-violet-400 bg-violet-50 cursor-wait'
                    : 'border-gray-300 cursor-pointer hover:border-violet-400 hover:bg-violet-50'
                }`}
              >
                {uploadingFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <File className="w-6 h-6 text-violet-500" />
                      <span className="text-violet-600 font-medium text-sm truncate max-w-[200px]">
                        {uploadedFileName}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                      <span className="text-violet-600 text-sm">
                        {uploadProgress < 100 ? `מעלה... ${uploadProgress}%` : 'מעבד את הקובץ...'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">לחץ להעלאת קובץ</p>
                    <p className="text-sm text-gray-400">MD, TXT, DOCX (עד 10MB)</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingFile}
                />
              </div>

              <div className="text-center text-gray-400 text-sm">- או -</div>

              {/* Paste Content */}
              <div>
                <label className="form-label">הדבק תוכן מסמך</label>
                <textarea
                  className="form-textarea font-mono text-sm"
                  rows={10}
                  placeholder="הדבק כאן את תוכן המסמך לדוגמה..."
                  value={uploadedContent}
                  onChange={(e) => setUploadedContent(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">שם התבנית</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="מסמך אפיון לדוגמה"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">סוג מסמך</label>
                  <select
                    className="form-input"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="specification">מסמך אפיון</option>
                    <option value="design">מסמך עיצוב</option>
                    <option value="architecture">מסמך ארכיטקטורה</option>
                    <option value="agile">מסמך AGILE</option>
                    <option value="other">אחר</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || !uploadedContent.trim()}
                className="btn btn-primary w-full justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    מנתח את המסמך...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    נתח ולמד מהמסמך
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Result */}
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-violet-600" />
              תוצאות הניתוח
            </h2>

            <div className="min-h-[400px] max-h-[600px] overflow-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p>מנתח את מבנה המסמך...</p>
                  <p className="text-sm">לומד סגנון, פרקים ופורמטים</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4">
                  {analysisResult.metadata?.demoMode && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                      <span className="text-lg">⚡</span>
                      <span>מצב דמו - חבר API Key לניתוח אמיתי</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>התבנית נשמרה בהצלחה!</span>
                  </div>

                  <MarkdownRenderer content={analysisResult.analysis} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                  <p>העלה מסמך לדוגמה</p>
                  <p className="text-sm">המערכת תלמד ממנו את המבנה והסגנון</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="card">
          <h2 className="font-semibold mb-4">התבניות השמורות</h2>

          {loadingTemplates ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <FileText className="w-10 h-10 mb-2 opacity-50" />
              <p>אין תבניות שמורות</p>
              <p className="text-sm">העלה מסמך לדוגמה כדי ליצור תבנית</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">
                          {template.documentType} • {new Date(template.createdAt).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              יצירת מסמך מתבנית
            </h2>

            <div className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="form-label">בחר תבנית *</label>
                <select
                  className="form-input"
                  value={selectedTemplate?.id || ''}
                  onChange={(e) => {
                    const t = templates.find(t => t.id === e.target.value);
                    setSelectedTemplate(t || null);
                  }}
                >
                  <option value="">בחר תבנית...</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">שם הפרויקט *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="מערכת ניהול מלאי"
                  value={projectInfo.projectName}
                  onChange={(e) => setProjectInfo({ ...projectInfo, projectName: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">תיאור הפרויקט *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="תאר את הפרויקט, מטרתו וקהל היעד..."
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">דרישות עיקריות</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="רשום את הדרישות העיקריות (שורה לכל דרישה)..."
                  value={projectInfo.requirements}
                  onChange={(e) => setProjectInfo({ ...projectInfo, requirements: e.target.value })}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating || !selectedTemplate}
                className="btn btn-primary w-full justify-center"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    יוצר מסמך לפי התבנית...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    צור מסמך לפי התבנית
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">המסמך שנוצר</h2>
              {generatedDocument && (
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedDocument.document)}
                    className="btn btn-secondary text-sm py-1"
                  >
                    <Copy className="w-4 h-4" />
                    העתק
                  </button>
                  <button
                    onClick={downloadDocument}
                    className="btn btn-secondary text-sm py-1"
                  >
                    <Download className="w-4 h-4" />
                    הורד
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[400px] max-h-[600px] overflow-auto">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p>יוצר מסמך לפי התבנית...</p>
                </div>
              ) : generatedDocument ? (
                <div className="space-y-4">
                  {generatedDocument.metadata?.demoMode && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                      <span className="text-lg">⚡</span>
                      <span>מצב דמו - חבר API Key לתוכן מותאם אישית</span>
                    </div>
                  )}
                  <MarkdownRenderer content={generatedDocument.document} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                  <p>בחר תבנית ומלא פרטי פרויקט</p>
                  <p className="text-sm">המסמך ייווצר לפי המבנה שלמדנו</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateLearningPage;
