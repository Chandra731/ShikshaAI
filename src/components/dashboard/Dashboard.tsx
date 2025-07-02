import { useState, useEffect } from 'react';
import { BookOpen, Brain, Trophy, Clock, Volume2, Target, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SubjectGrid } from './SubjectGrid';
import { ProgressOverview } from './ProgressOverview';
import { StudyPlan } from './StudyPlan';

export function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'subjects' | 'progress' | 'plan'>('subjects');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTargetSubjects = () => {
    if (!profile) return [];
    
    // Use preferred subjects if available, otherwise default based on exam type
    if (profile.preferred_subjects && profile.preferred_subjects.length > 0) {
      return profile.preferred_subjects;
    }
    
    switch (profile.exam_type) {
      case 'NEET':
        return ['Physics', 'Chemistry', 'Biology'];
      case 'JEE':
        return ['Physics', 'Chemistry', 'Mathematics'];
      case 'UPSC':
        return ['History', 'Geography', 'Polity', 'Economics', 'Science & Technology'];
      default:
        return ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SmartPath EduAI</h1>
                <p className="text-sm text-gray-600">AI-Powered Learning Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  {getGreeting()}, {profile?.full_name || 'Student'}! 👋
                </p>
                <p className="text-sm text-gray-600">
                  Class {profile?.grade_level} • {profile?.exam_type} • {profile?.learning_style} learner
                </p>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'subjects', label: 'My Subjects', icon: BookOpen },
              { id: 'progress', label: 'Progress', icon: Trophy },
              { id: 'plan', label: 'Study Plan', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'subjects' && (
          <SubjectGrid subjects={getTargetSubjects()} profile={profile} />
        )}
        {activeTab === 'progress' && (
          <ProgressOverview userId={user?.id} />
        )}
        {activeTab === 'plan' && (
          <StudyPlan profile={profile} />
        )}
      </main>
    </div>
  );
}