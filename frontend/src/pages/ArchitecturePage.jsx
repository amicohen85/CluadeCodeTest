import React, { useState } from 'react';
import { Network, Send, Loader2, Database, Link2, Layers, Download, Copy } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { architectureApi } from '../services/api';

function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState('system');
  const [formData, setFormData] = useState({
    // System architecture
    systemName: '',
    description: '',
    components: '',
    integrations: '',
    // Interface
    interfaceName: '',
    type: 'REST',
    producer: '',
    consumer: '',
    // Database
    entities: '',
    relationships: '',
    databaseType: 'PostgreSQL'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'system', label: 'ארכיטקטורה', icon: Layers },
    { id: 'interface', label: 'ממשקים', icon: Link2 },
    { id: 'database', label: 'בסיס נתונים', icon: Database }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (activeTab === 'system') {
        response = await architectureApi.generate({
          systemName: formData.systemName,
          description: formData.description,
          components: formData.components.split('\n').filter(Boolean),
          integrations: formData.integrations.split('\n').filter(Boolean)
        });
      } else if (activeTab === 'interface') {
        response = await architectureApi.generateInterface({
          interfaceName: formData.interfaceName,
          type: formData.type,
          producer: formData.producer,
          consumer: formData.consumer
        });
      } else {
        response = await architectureApi.generateDatabase({
          entities: formData.entities.split('\n').filter(Boolean),
          relationships: formData.relationships.split('\n').filter(Boolean),
          databaseType: formData.databaseType
        });
      }

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ביצירת הארכיטקטורה');
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
      a.download = `architecture-${formData.systemName || 'diagram'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-semibold">ארכיטקטורה וממשקים</h2>
                <p className="text-sm text-gray-500">תכנון טכני מערכתי</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'system' && (
              <>
                <div>
                  <label className="form-label">שם המערכת *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="לדוגמה: מערכת ניהול הזמנות"
                    value={formData.systemName}
                    onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">תיאור המערכת *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="תאר את המערכת, מטרתה ויכולותיה העיקריות..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">רכיבים נדרשים (שורה לכל רכיב)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="שרת API&#10;בסיס נתונים&#10;מערכת Cache&#10;Message Queue"
                    value={formData.components}
                    onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">אינטגרציות חיצוניות</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="שער תשלום&#10;שירות SMS&#10;מערכת ERP"
                    value={formData.integrations}
                    onChange={(e) => setFormData({ ...formData, integrations: e.target.value })}
                  />
                </div>
              </>
            )}

            {activeTab === 'interface' && (
              <>
                <div>
                  <label className="form-label">שם הממשק *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="לדוגמה: Orders API"
                    value={formData.interfaceName}
                    onChange={(e) => setFormData({ ...formData, interfaceName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">סוג ממשק</label>
                  <select
                    className="form-input"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="REST">REST API</option>
                    <option value="GraphQL">GraphQL</option>
                    <option value="gRPC">gRPC</option>
                    <option value="WebSocket">WebSocket</option>
                    <option value="Message Queue">Message Queue</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">מערכת מספקת *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Orders Service"
                      value={formData.producer}
                      onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">מערכת צורכת *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Web Frontend"
                      value={formData.consumer}
                      onChange={(e) => setFormData({ ...formData, consumer: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'database' && (
              <>
                <div>
                  <label className="form-label">סוג בסיס נתונים</label>
                  <select
                    className="form-input"
                    value={formData.databaseType}
                    onChange={(e) => setFormData({ ...formData, databaseType: e.target.value })}
                  >
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="Redis">Redis</option>
                    <option value="Elasticsearch">Elasticsearch</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">ישויות (שורה לכל ישות) *</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="User - משתמש במערכת&#10;Order - הזמנה&#10;Product - מוצר&#10;OrderItem - פריט בהזמנה"
                    value={formData.entities}
                    onChange={(e) => setFormData({ ...formData, entities: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">קשרים בין ישויות</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="User has many Orders&#10;Order has many OrderItems&#10;Product appears in OrderItems"
                    value={formData.relationships}
                    onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
                  />
                </div>
              </>
            )}

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
                  מייצר ארכיטקטורה...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  צור תרשים ארכיטקטורה
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">תרשים ומפרט</h2>
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

          <div className="min-h-[400px] max-h-[700px] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>מייצר תרשים ארכיטקטורה...</p>
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
                <Network className="w-12 h-12 mb-4 opacity-50" />
                <p>תרשים הארכיטקטורה יופיע כאן</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchitecturePage;
