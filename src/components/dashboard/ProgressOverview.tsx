import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Award, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProgressOverviewProps {
  userId?: string;
}

interface ProgressData {
  subject: string;
  topic: string;
  completion: number;
  quiz_score: number | null;
  completed_at: string;
  time_spent: number;
}

export function ProgressOverview({ userId }: ProgressOverviewProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  const fetchProgress = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        subject: item.subject,
        topic: item.topic,
        completion: 100, // Assuming completed items are 100%
        quiz_score: item.quiz_score,
        completed_at: item.completed_at || new Date().toISOString(),
        time_spent: item.time_spent || 0,
      })) || [];

      setProgressData(formattedData);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStats = () => {
    if (progressData.length === 0) {
      return {
        totalCompletion: 0,
        averageScore: 0,
        totalTopics: 0,
        recentActivity: 0,
      };
    }

    const totalCompletion = Math.round(
      progressData.reduce((sum, item) => sum + item.completion, 0) / progressData.length
    );

    const scoresOnly = progressData.filter(item => item.quiz_score !== null);
    const averageScore = scoresOnly.length > 0
      ? Math.round(scoresOnly.reduce((sum, item) => sum + (item.quiz_score || 0), 0) / scoresOnly.length)
      : 0;

    const totalTopics = progressData.length;
    const recentActivity = progressData.filter(item => {
      const completedAt = new Date(item.completed_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return completedAt > weekAgo;
    }).length;

    return { totalCompletion, averageScore, totalTopics, recentActivity };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Progress Overview</h2>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalCompletion}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Overall Completion</h3>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.averageScore}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Average Quiz Score</h3>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalTopics}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Topics Completed</h3>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.recentActivity}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Active This Week</h3>
        </div>
      </div>

      {/* Progress List */}
      {progressData.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Learning Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {progressData.slice(0, 10).map((item, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      {item.subject} - {item.topic}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Completed: {new Date(item.completed_at).toLocaleDateString()}
                    </p>
                    {item.time_spent > 0 && (
                      <p className="text-xs text-gray-500">
                        Time spent: {Math.round(item.time_spent / 60)} minutes
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">{item.completion}%</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                    {item.quiz_score !== null && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{item.quiz_score}%</div>
                        <div className="text-xs text-gray-500">Quiz Score</div>
                      </div>
                    )}
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Progress Yet</h3>
          <p className="text-gray-600 mb-6">
            Start learning to see your progress and achievements here
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Explore Subjects
          </button>
        </div>
      )}
    </div>
  );
}