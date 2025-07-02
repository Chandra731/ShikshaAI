import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Brain, ChevronRight, BookOpen, Target } from 'lucide-react';
import { generateChunkedContent, generateFlashcard, generateQuiz } from '../../lib/groq';
import { playTextToSpeech } from '../../lib/elevenlabs';
import { ContentChunk } from './ContentChunk';
import { Flashcard } from './Flashcard';
import { Quiz } from './Quiz';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface LearningSessionProps {
  subject: string;
  chapter: string;
  roadmap: string;
  profile: any;
  onClose: () => void;
  onBack: () => void;
}

type SessionStep = 'content' | 'flashcard' | 'quiz' | 'complete';

export function LearningSession({ subject, chapter, roadmap, profile, onClose, onBack }: LearningSessionProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<SessionStep>('content');
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks] = useState(5); // Reduced for better UX
  const [content, setContent] = useState<string>('');
  const [flashcard, setFlashcard] = useState<{ front: string; back: string } | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(profile?.learning_style === 'audio');
  const [loading, setLoading] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    loadCurrentContent();
  }, [currentChunk, currentStep]);

  const loadCurrentContent = async () => {
    setLoading(true);
    try {
      if (currentStep === 'content') {
        const chunkContent = await generateChunkedContent(
          `${subject} - ${chapter}`,
          currentChunk,
          profile
        );
        setContent(chunkContent);
        
        // Auto-play audio if voice is enabled
        if (voiceEnabled) {
          setTimeout(() => {
            playTextToSpeech(chunkContent);
          }, 500);
        }
      } else if (currentStep === 'flashcard') {
        const card = await generateFlashcard(
          `${subject} - ${chapter}`,
          `Chunk ${currentChunk + 1} concepts`
        );
        setFlashcard(card);
      } else if (currentStep === 'quiz') {
        const quizData = await generateQuiz(`${subject} - ${chapter}`, 'medium');
        setQuiz(quizData);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      // Provide fallback content
      if (currentStep === 'content') {
        setContent(`Welcome to ${subject} - ${chapter}!\n\nThis is an important topic that will help you understand the fundamental concepts. Let's break it down step by step.\n\nAre you ready to learn something amazing?`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 'content') {
      setCurrentStep('flashcard');
    } else if (currentStep === 'flashcard') {
      setCurrentStep('quiz');
    } else if (currentStep === 'quiz') {
      if (currentChunk < totalChunks - 1) {
        setCurrentChunk(currentChunk + 1);
        setCurrentStep('content');
      } else {
        setCurrentStep('complete');
        await saveProgress();
      }
    }
  };

  const saveProgress = async () => {
    if (!user) return;

    try {
      const timeSpent = Math.round((Date.now() - sessionStartTime) / 1000 / 60); // minutes
      
      await supabase.from('student_progress').upsert({
        user_id: user.id,
        subject,
        topic: chapter,
        subtopic: `Complete Chapter`,
        completed_at: new Date().toISOString(),
        quiz_score: 85, // Placeholder score
        time_spent: timeSpent,
        difficulty_level: 'medium'
      });

      // Also save to learning_roadmaps for tracking
      await supabase.from('learning_roadmaps').upsert({
        user_id: user.id,
        subject,
        topic: chapter,
        plan_type: 'deep-learning',
        roadmap_data: { roadmap, completed: true },
        progress: { chunks_completed: totalChunks, total_chunks: totalChunks },
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getProgressPercentage = () => {
    const totalSteps = totalChunks * 3; // content + flashcard + quiz per chunk
    const completedSteps = currentChunk * 3 + 
      (currentStep === 'content' ? 0 : 
       currentStep === 'flashcard' ? 1 : 
       currentStep === 'quiz' ? 2 : 3);
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'content': return <BookOpen className="w-5 h-5" />;
      case 'flashcard': return <Brain className="w-5 h-5" />;
      case 'quiz': return <Target className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getStepLabel = () => {
    switch (currentStep) {
      case 'content': return 'Learning';
      case 'flashcard': return 'Review';
      case 'quiz': return 'Practice';
      default: return 'Learning';
    }
  };

  if (currentStep === 'complete') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Chapter Complete!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Congratulations! You've successfully completed <strong>{chapter}</strong> in {subject}.
          </p>
          
          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-4">What You've Achieved</h3>
            <div className="grid grid-cols-2 gap-4 text-green-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Learned {totalChunks} key concepts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Reviewed {totalChunks} flashcards</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Completed {totalChunks} quizzes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Progress saved automatically</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Choose Another Chapter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {subject} - {chapter}
              </h1>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  {getStepIcon()}
                  <span>{getStepLabel()}</span>
                </div>
                <span>•</span>
                <span>Section {currentChunk + 1} of {totalChunks}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${voiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
              `}
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <div className="text-sm text-gray-600 font-medium">
              {getProgressPercentage()}% Complete
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Preparing your {getStepLabel().toLowerCase()} content...
              </h3>
              <p className="text-gray-600">
                AI is personalizing this content based on your learning style
              </p>
            </div>
          ) : (
            <>
              {currentStep === 'content' && (
                <ContentChunk
                  content={content}
                  onNext={handleNext}
                  onPlayAudio={() => voiceEnabled && playTextToSpeech(content)}
                  voiceEnabled={voiceEnabled}
                />
              )}
              
              {currentStep === 'flashcard' && flashcard && (
                <Flashcard
                  flashcard={flashcard}
                  onNext={handleNext}
                />
              )}
              
              {currentStep === 'quiz' && quiz && (
                <Quiz
                  quiz={quiz}
                  onNext={handleNext}
                  onSaveScore={saveProgress}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}