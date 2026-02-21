'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Type, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  Target,
  Award
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalLessons: number;
  totalVocabulary: number;
  totalQuizzes: number;
  completionRates: {
    lessons: number;
    vocabulary: number;
    quizzes: number;
  };
  topLessons: { id: string; title: string; views: number; completions: number }[];
  topVocabulary: { word: string; timesPracticed: number }[];
  userActivity: { date: string; activeUsers: number }[];
  avgSessionTime: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    // Simulated analytics data - in production this would come from Firestore
    const mockData: AnalyticsData = {
      totalUsers: 1247,
      activeUsers: 342,
      newUsersThisMonth: 89,
      totalLessons: 24,
      totalVocabulary: 543,
      totalQuizzes: 18,
      completionRates: {
        lessons: 67,
        vocabulary: 45,
        quizzes: 72,
      },
      topLessons: [
        { id: '1', title: 'Greetings & Introductions', views: 1243, completions: 892 },
        { id: '2', title: 'Numbers 1-100', views: 987, completions: 654 },
        { id: '3', title: 'Common Phrases', views: 876, completions: 543 },
        { id: '4', title: 'Food & Drinks', views: 765, completions: 432 },
        { id: '5', title: 'Directions', views: 654, completions: 321 },
      ],
      topVocabulary: [
        { word: 'Labas', timesPracticed: 4521 },
        { word: 'Shukran', timesPracticed: 4234 },
        { word: 'Bslama', timesPracticed: 3892 },
        { word: 'Neshlef', timesPracticed: 3421 },
        { word: 'Bghit', timesPracticed: 3102 },
      ],
      userActivity: [
        { date: 'Mon', activeUsers: 234 },
        { date: 'Tue', activeUsers: 287 },
        { date: 'Wed', activeUsers: 312 },
        { date: 'Thu', activeUsers: 298 },
        { date: 'Fri', activeUsers: 276 },
        { date: 'Sat', activeUsers: 198 },
        { date: 'Sun', activeUsers: 189 },
      ],
      avgSessionTime: 18, // minutes
    };
    
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, [dateRange]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { title: 'Total Users', value: data.totalUsers.toLocaleString(), icon: Users, change: '+12%', trend: 'up', color: '#10b981' },
    { title: 'Active Users', value: data.activeUsers.toLocaleString(), icon: Activity, change: '+8%', trend: 'up', color: '#0891b2' },
    { title: 'New This Month', value: data.newUsersThisMonth.toString(), icon: TrendingUp, change: '+24%', trend: 'up', color: '#8b5cf6' },
    { title: 'Avg Session', value: `${data.avgSessionTime} min`, icon: Clock, change: '+5%', trend: 'up', color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>Analytics Dashboard</h1>
          <p style={{ fontSize: 13, color: '#5a6880' }}>Track user engagement and content performance</p>
        </div>
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, background: '#0f1117', border: '1px solid #1e2130', color: '#f0f4ff', fontSize: 13 }}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{ background: '#0f1117', borderRadius: 12, padding: 20, border: '1px solid #1e2130' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: stat.trend === 'up' ? '#10b981' : '#ef4444' }}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#5a6880' }}>{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* User Activity Chart */}
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 20, border: '1px solid #1e2130' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 20 }}>User Activity (Last 7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180 }}>
            {data.userActivity.map((day, i) => {
              const maxUsers = Math.max(...data.userActivity.map(d => d.activeUsers));
              const height = (day.activeUsers / maxUsers) * 140;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: '100%', height: 140, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ 
                      width: '80%', 
                      height, 
                      background: 'linear-gradient(180deg, #10b981, #0891b2)', 
                      borderRadius: 6,
                      transition: 'height 0.3s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#5a6880' }}>{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Rates */}
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 20, border: '1px solid #1e2130' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 20 }}>Completion Rates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Lessons', value: data.completionRates.lessons, icon: BookOpen, color: '#10b981' },
              { label: 'Vocabulary', value: data.completionRates.vocabulary, icon: Type, color: '#0891b2' },
              { label: 'Quizzes', value: data.completionRates.quizzes, icon: HelpCircle, color: '#8b5cf6' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <item.icon size={14} style={{ color: item.color }} />
                    <span style={{ fontSize: 13, color: '#f0f4ff' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff' }}>{item.value}%</span>
                </div>
                <div style={{ height: 6, background: '#1e2130', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top Lessons */}
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 20, border: '1px solid #1e2130' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 16 }}>Top Performing Lessons</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.topLessons.map((lesson, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#1e2130', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#10b981' }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: '#f0f4ff' }}>{lesson.title}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#5a6880' }}>
                  <span>{lesson.views.toLocaleString()} views</span>
                  <span>{lesson.completions.toLocaleString()} done</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vocabulary */}
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 20, border: '1px solid #1e2130' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 16 }}>Most Practiced Words</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.topVocabulary.map((word, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#1e2130', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: '#0891b220', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#0891b2' }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: '#f0f4ff' }}>{word.word}</span>
                </div>
                <span style={{ fontSize: 12, color: '#5a6880' }}>{word.timesPracticed.toLocaleString()} practices</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
