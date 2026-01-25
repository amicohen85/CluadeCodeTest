import React, { useState } from 'react';
import { Palette, Send, Loader2, Monitor, Smartphone, Tablet, Copy, Download } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { designApi } from '../services/api';

function DesignPage() {
  const [activeTab, setActiveTab] = useState('screen');
  const [formData, setFormData] = useState({
    screenName: '',
    purpose: '',
    features: '',
    userType: '',
    platform: 'web',
    // User flow fields
    processName: '',
    steps: '',
    actors: '',
    // Wireframe fields
    name: '',
    description: '',
    userGoals: '',
    actions: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'screen', label: 'עיצוב מסך', icon: Monitor },
    { id: 'userflow', label: 'זרימת משתמש', icon: Tablet },
    { id: 'wireframe', label: 'Wireframe', icon: Smartphone }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (activeTab === 'screen') {
        response = await designApi.generateScreens({
          screenName: formData.screenName,
          purpose: formData.purpose,
          features: formData.features.split('\n').filter(Boolean),
          userType: formData.userType,
          platform: formData.platform
        });
      } else if (activeTab === 'userflow') {
        response = await designApi.generateUserFlow({
          processName: formData.processName,
          steps: formData.steps.split('\n').filter(Boolean),
          actors: formData.actors
        });
      } else {
        response = await designApi.generateWireframe({
          name: formData.name,
          description: formData.description,
          userGoals: formData.userGoals,
          actions: formData.actions.split('\n').filter(Boolean)
        });
      }

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ביצירת העיצוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold">עיצוב מסכים</h2>
                <p className="text-sm text-gray-500">יצירת מפרטי UI/UX</p>
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
                      ? 'bg-purple-100 text-purple-700 font-medium'
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
            {activeTab === 'screen' && (
              <>
                <div>
                  <label className="form-label">שם המסך *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="לדוגמה: דשבורד ראשי, דף הרשמה, עגלת קניות"
                    value={formData.screenName}
                    onChange={(e) => setFormData({ ...formData, screenName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">מטרת המסך *</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="תאר מה המשתמש צריך להשיג במסך זה..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">פיצ'רים נדרשים (שורה לכל פיצ'ר)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="טבלת נתונים עם מיון וסינון&#10;גרפים אינטראקטיביים&#10;כפתורי פעולה מהירים"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">סוג משתמש</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="מנהל, לקוח, אורח"
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">פלטפורמה</label>
                    <select
                      className="form-input"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    >
                      <option value="web">Web (Responsive)</option>
                      <option value="mobile">Mobile</option>
                      <option value="desktop">Desktop App</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'userflow' && (
              <>
                <div>
                  <label className="form-label">שם התהליך *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="לדוגמה: תהליך רכישה, הרשמה למערכת"
                    value={formData.processName}
                    onChange={(e) => setFormData({ ...formData, processName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">שלבים בתהליך (שורה לכל שלב) *</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    placeholder="כניסה לעמוד המוצר&#10;בחירת כמות ומאפיינים&#10;הוספה לעגלה&#10;מעבר לתשלום&#10;הזנת פרטי משלוח&#10;ביצוע תשלום"
                    value={formData.steps}
                    onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">שחקנים/משתמשים</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="לקוח, מערכת, שער תשלום"
                    value={formData.actors}
                    onChange={(e) => setFormData({ ...formData, actors: e.target.value })}
                  />
                </div>
              </>
            )}

            {activeTab === 'wireframe' && (
              <>
                <div>
                  <label className="form-label">שם הפיצ'ר *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="לדוגמה: טופס יצירת קשר, לוח בקרה"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">תיאור *</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="תאר את הפיצ'ר ומה הוא כולל..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">מטרות המשתמש</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="שליחת הודעה, קבלת מידע"
                    value={formData.userGoals}
                    onChange={(e) => setFormData({ ...formData, userGoals: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">פעולות עיקריות</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="מילוי טופס&#10;שליחה&#10;קבלת אישור"
                    value={formData.actions}
                    onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
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
                  מייצר עיצוב...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  צור עיצוב
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">מפרט עיצוב</h2>
          </div>

          <div className="min-h-[400px] max-h-[600px] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>מייצר מפרט עיצוב מפורט...</p>
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
                <Palette className="w-12 h-12 mb-4 opacity-50" />
                <p>מפרט העיצוב יופיע כאן</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignPage;
