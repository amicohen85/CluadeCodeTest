import React, { useState } from 'react';
import { ListTodo, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { agileApi } from '../services/api';

function AgilePage() {
  const [specification, setSpecification] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedEpics, setExpandedEpics] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await agileApi.breakdown({ specification });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בפירוק למשימות AGILE');
    } finally {
      setLoading(false);
    }
  };

  const toggleEpic = (epicId) => {
    setExpandedEpics(prev => ({
      ...prev,
      [epicId]: !prev[epicId]
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const parsedData = result?.parsed?.epics ? result.parsed : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold">פירוק ל-AGILE</h2>
                <p className="text-sm text-gray-500">המרת אפיון למשימות</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">מסמך אפיון או דרישות *</label>
              <textarea
                className="form-textarea"
                rows={15}
                placeholder="הדבק כאן את מסמך האפיון או רשימת הדרישות...&#10;&#10;לדוגמה:&#10;- מערכת ניהול לקוחות עם יכולות CRM&#10;- דשבורד אנליטי עם גרפים&#10;- מודול דוחות וייצוא לאקסל&#10;- ממשק API לאינטגרציה"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                required
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
                  מפרק למשימות...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  צור משימות AGILE
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Epics & User Stories</h2>
            {parsedData && (
              <div className="text-sm text-gray-500">
                סה"כ: {parsedData.totalStoryPoints || 0} נקודות
              </div>
            )}
          </div>

          <div className="min-h-[400px] max-h-[600px] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>מפרק את הדרישות למשימות...</p>
              </div>
            ) : parsedData ? (
              <div className="space-y-4">
                {parsedData.epics?.map((epic, idx) => (
                  <div key={epic.id || idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleEpic(epic.id || idx)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {epic.id || `EPIC-${idx + 1}`}
                        </span>
                        <span className="font-medium text-gray-900">{epic.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(epic.priority)}`}>
                          {epic.priority}
                        </span>
                      </div>
                      {expandedEpics[epic.id || idx] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedEpics[epic.id || idx] && (
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-600">{epic.description}</p>

                        {epic.userStories?.map((story, sIdx) => (
                          <div key={story.id || sIdx} className="bg-white border border-gray-100 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {story.id || `US-${sIdx + 1}`}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(story.priority)}`}>
                                  {story.storyPoints} SP
                                </span>
                              </div>
                              <div className="flex gap-1">
                                {story.labels?.map((label, lIdx) => (
                                  <span key={lIdx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">{story.title}</h4>
                            <p className="text-sm text-gray-600">{story.description}</p>

                            {story.acceptanceCriteria?.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-xs font-medium text-gray-500 mb-1">קריטריונים לקבלה:</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {story.acceptanceCriteria.map((ac, acIdx) => (
                                    <li key={acIdx}>✓ {ac}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : result?.data ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {result.data}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <ListTodo className="w-12 h-12 mb-4 opacity-50" />
                <p>המשימות יופיעו כאן</p>
                <p className="text-sm">הזן אפיון ולחץ על "צור משימות AGILE"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgilePage;
