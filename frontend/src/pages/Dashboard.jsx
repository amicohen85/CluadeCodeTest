import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ListTodo,
  Palette,
  Network,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react';

const features = [
  {
    title: 'יצירת מסמכי אפיון',
    description: 'הפקת מסמכי אפיון מקיפים על בסיס דרישות ותיאור הפרויקט',
    icon: FileText,
    href: '/specification',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'פירוק ל-AGILE',
    description: 'המרת אפיון לאפיקים, User Stories ומשימות עם הערכת Story Points',
    icon: ListTodo,
    href: '/agile',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'עיצוב מסכים',
    description: 'יצירת מפרטי עיצוב UI/UX, זרימות משתמש ו-Design System',
    icon: Palette,
    href: '/design',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'ארכיטקטורה וממשקים',
    description: 'תרשימי ארכיטקטורה, מיפוי ממשקים וסכמת בסיס נתונים',
    icon: Network,
    href: '/architecture',
    color: 'from-orange-500 to-orange-600'
  }
];

const benefits = [
  'חיסכון של שעות עבודה ביצירת מסמכים',
  'עקביות בפורמט ובאיכות המסמכים',
  'כיסוי מקיף של כל ההיבטים הטכניים',
  'תמיכה בתרשימים ויזואליים (Mermaid)',
  'תאימות מלאה למתודולוגיית AGILE'
];

function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8" />
              <span className="text-lg font-medium opacity-90">AI-Powered</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              מערכת ניתוח מערכות חכמה
            </h1>
            <p className="text-lg opacity-90 mb-6 max-w-xl">
              כלי מבוסס בינה מלאכותית ליצירת מסמכי אפיון, פירוק משימות,
              עיצוב מסכים ותכנון ארכיטקטורה - הכל במקום אחד.
            </p>
            <Link
              to="/specification"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              התחל עכשיו
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 bg-white/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-24 h-24 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">יכולות המערכת</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {feature.description}
                    </p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">למה להשתמש במערכת?</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-1">4</div>
          <div className="text-sm text-gray-500">סוכני AI</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">∞</div>
          <div className="text-sm text-gray-500">פרויקטים</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
          <div className="text-sm text-gray-500">זמינות</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            <Clock className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-sm text-gray-500">חיסכון בזמן</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
