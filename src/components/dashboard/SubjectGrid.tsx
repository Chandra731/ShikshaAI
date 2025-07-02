import { useState } from 'react';
import { Book, ChevronRight, Atom, FlaskConical, Calculator, Heart, Globe, Landmark, Users, Zap, Target, GraduationCap, Brain, Volume2 } from 'lucide-react';
import { ChapterModal } from '../learning/ChapterModal';


interface SubjectGridProps {
  subjects: string[];
  profile: any;
}

const subjectIcons: { [key: string]: any } = {
  'Physics': Atom,
  'Chemistry': FlaskConical,
  'Mathematics': Calculator,
  'Biology': Heart,
  'History': Landmark,
  'Geography': Globe,
  'Polity': Users,
  'Economics': Calculator,
  'Science & Technology': Zap,
  'English': Book,
};

const subjectColors: { [key: string]: string } = {
  'Physics': 'bg-blue-100 text-blue-700 border-blue-200',
  'Chemistry': 'bg-green-100 text-green-700 border-green-200',
  'Mathematics': 'bg-purple-100 text-purple-700 border-purple-200',
  'Biology': 'bg-red-100 text-red-700 border-red-200',
  'History': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Geography': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Polity': 'bg-pink-100 text-pink-700 border-pink-200',
  'Economics': 'bg-orange-100 text-orange-700 border-orange-200',
  'Science & Technology': 'bg-teal-100 text-teal-700 border-teal-200',
  'English': 'bg-gray-100 text-gray-700 border-gray-200',
};

export function SubjectGrid({ subjects, profile }: SubjectGridProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const getSubjectDescription = (subject: string) => {
    const descriptions: { [key: string]: string } = {
      'Physics': 'Master the fundamental laws of nature with interactive simulations',
      'Chemistry': 'Explore matter, reactions, and molecular structures',
      'Mathematics': 'Build strong problem-solving skills with step-by-step guidance',
      'Biology': 'Discover life sciences from cells to ecosystems',
      'History': 'Journey through time and understand civilizations',
      'Geography': 'Explore Earth\'s physical and human landscapes',
      'Polity': 'Understand governance, constitution, and political systems',
      'Economics': 'Learn how societies manage resources and wealth',
      'Science & Technology': 'Stay updated with modern scientific advancements',
      'English': 'Enhance language skills and literary appreciation',
    };
    return descriptions[subject] || 'Comprehensive subject coverage with AI guidance';
  };

  const getChapterCount = (subject: string) => {
    // Simulated chapter counts based on typical curriculum
    const chapterCounts: { [key: string]: number } = {
      'Physics': 15,
      'Chemistry': 16,
      'Mathematics': 13,
      'Biology': 22,
      'History': 10,
      'Geography': 8,
      'Polity': 12,
      'Economics': 10,
      'Science & Technology': 15,
      'English': 12,
    };
    return chapterCounts[subject] || 10;
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Learning Dashboard</h2>
        <p className="text-gray-600 text-lg">
          Welcome back, {profile?.full_name}! Ready to continue your {profile?.exam_type} preparation?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Target Exam</p>
              <p className="text-2xl font-bold">{profile?.exam_type}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Class Level</p>
              <p className="text-2xl font-bold">Class {profile?.grade_level}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Learning Style</p>
              <p className="text-2xl font-bold capitalize">{profile?.learning_style}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose a Subject to Start Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const Icon = subjectIcons[subject] || Book;
            const colorClass = subjectColors[subject] || subjectColors['English'];
            const chapterCount = getChapterCount(subject);
            
            return (
              <div
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-14 h-14 rounded-xl border-2 flex items-center justify-center
                    ${colorClass}
                  `}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {subject}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {getSubjectDescription(subject)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">{chapterCount} Chapters</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                    {profile?.exam_type} Ready
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Progress: 0%</span>
                    <span>Start Learning →</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Features */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            🚀 AI-Powered Learning Experience
          </h3>
          <p className="text-gray-600">
            Every subject features personalized content designed just for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Smart Roadmaps</h4>
            <p className="text-sm text-gray-600">AI creates personalized study plans based on your timeline and goals</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Voice Explanations</h4>
            <p className="text-sm text-gray-600">Listen to concepts explained in natural, engaging voice narration</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Adaptive Quizzes</h4>
            <p className="text-sm text-gray-600">Interactive tests that adapt to your learning style and pace</p>
          </div>
        </div>
      </div>

      {selectedSubject && (
        <ChapterModal
          subject={selectedSubject}
          profile={profile}
          onClose={() => setSelectedSubject(null)}
        />
      )}
    </>
  );
}