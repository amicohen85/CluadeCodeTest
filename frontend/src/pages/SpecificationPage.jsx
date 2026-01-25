import React, { useState } from 'react';
import { FileText, Send, Loader2, Copy, Download, CheckCircle } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { specificationApi } from '../services/api';

function SpecificationPage() {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    requirements: '',
    stakeholders: '',
    constraints: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requirements = formData.requirements
        .split('\n')
        .filter(r => r.trim());

      const stakeholders = formData.stakeholders
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const response = await specificationApi.generate({
        ...formData,
        requirements,
        stakeholders
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ביצירת מסמך האפיון');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.data) {
      navigator.clipboard.writeText(result.data);
    }
  };

  const downloadAsMarkdown = () => {
    if (result?.data) {
      const blob = new Blob([result.data], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.projectName || 'specification'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold">יצירת מסמך אפיון</h2>
                <p className="text-sm text-gray-500">הזן פרטי הפרויקט</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">שם הפרויקט *</label>
              <input
                type="text"
                className="form-input"
                placeholder="לדוגמה: מערכת ניהול לקוחות"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">תיאור הפרויקט *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="תאר את מטרת המערכת, הקהל היעד והפונקציונליות העיקרית..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">דרישות (שורה לכל דרישה)</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="המערכת תאפשר רישום משתמשים&#10;המערכת תתמוך בהתחברות דו-שלבית&#10;המערכת תציג דשבורד אנליטי"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">בעלי עניין (מופרדים בפסיק)</label>
              <input
                type="text"
                className="form-input"
                placeholder="מנהל מוצר, מפתחים, לקוחות, צוות תמיכה"
                value={formData.stakeholders}
                onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">אילוצים ומגבלות</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="תקציב, לוחות זמנים, טכנולוגיות קיימות..."
                value={formData.constraints}
                onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  מייצר מסמך אפיון...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  צור מסמך אפיון
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">תוצאה</h2>
            {result && (
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="btn btn-secondary text-sm py-1">
                  <Copy className="w-4 h-4" />
                  העתק
                </button>
                <button onClick={downloadAsMarkdown} className="btn btn-secondary text-sm py-1">
                  <Download className="w-4 h-4" />
                  הורד
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[400px] max-h-[600px] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>מייצר מסמך אפיון מקיף...</p>
                <p className="text-sm">זה עשוי לקחת מספר שניות</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {result.metadata?.demoMode && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                    <span className="text-lg">⚡</span>
                    <span>מצב דמו - חבר API Key לתוצאות מותאמות אישית</span>
                  </div>
                )}
                <MarkdownRenderer content={result.data} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FileText className="w-12 h-12 mb-4 opacity-50" />
                <p>מסמך האפיון יופיע כאן</p>
                <p className="text-sm">מלא את הטופס ולחץ על "צור מסמך אפיון"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificationPage;
