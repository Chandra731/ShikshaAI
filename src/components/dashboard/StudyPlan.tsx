import { useState, useEffect } from 'react';
import { Calendar, Clock, Target, BookOpen } from 'lucide-react';
import { generateRoadmap } from '../../lib/groq';

interface StudyPlanProps {
  profile: any;
}

export function StudyPlan({ profile }: StudyPlanProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1month' | '3months' | '6months' | '1year'>('3months');
  const [studyPlan, setStudyPlan] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateStudyPlan = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const plan = await generateRoadmap(
        'Comprehensive Study Plan',
        `${selectedTimeframe} preparation for ${profile.target_exam}`,
        getTimeframeDays(selectedTimeframe),
        profile
      );
      setStudyPlan(plan);
    } catch (error) {
      console.error('Error generating study plan:', error);
      setStudyPlan('Unable to generate study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeDays = (timeframe: string) => {
    switch (timeframe) {
      case '1month': return 30;
      case '3months': return 90;
      case '6months': return 180;
      case '1year': return 365;
      default: return 90;
    }
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case '1month': return '1 Month';
      case '3months': return '3 Months';
      case '6months': return '6 Months';
      case '1year': return '1 Year';
      default: return '3 Months';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Personalized Study Plan</h2>
        <p className="text-gray-600">
          Get an AI-generated study roadmap tailored to your goals and timeline
        </p>
      </div>

      {/* Target Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {profile?.target_exam} Preparation
            </h3>
            <p className="text-sm text-gray-600">
              Class {profile?.class_level} • {profile?.learning_style} Learning Style
            </p>
          </div>
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Preparation Timeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '1month', label: '1 Month', subtitle: 'Intensive' },
            { value: '3months', label: '3 Months', subtitle: 'Focused' },
            { value: '6months', label: '6 Months', subtitle: 'Balanced' },
            { value: '1year', label: '1 Year', subtitle: 'Comprehensive' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTimeframe(option.value as any)}
              className={`
                p-4 border-2 rounded-lg text-center transition-all
                ${selectedTimeframe === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <div className="text-sm font-medium text-gray-800">{option.label}</div>
              <div className="text-xs text-gray-600">{option.subtitle}</div>
            </button>
          ))}
        </div>
        
        <button
          onClick={generateStudyPlan}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating Plan...' : `Generate ${getTimeframeLabel(selectedTimeframe)} Study Plan`}
        </button>
      </div>

      {/* Generated Study Plan */}
      {studyPlan && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Your {getTimeframeLabel(selectedTimeframe)} Study Roadmap
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {studyPlan}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-800 mb-1">
                    Ready to Start Learning?
                  </h4>
                  <p className="text-sm text-green-700">
                    Begin with any subject from your dashboard. The AI will adapt the plan based on your progress and learning style.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!studyPlan && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Generate Your Study Plan</h3>
          <p className="text-gray-600">
            Select your preferred timeline and let AI create a personalized roadmap for your success
          </p>
        </div>
      )}
    </div>
  );
}