import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { generatePersonalizedLesson } from '../lib/groq';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

const Flashcards: React.FC = () => {
  const { subject, topic } = useParams<{ subject: string; topic: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const subjectNames: { [key: string]: string } = {
    math: 'Mathematics',
    science: 'Science',
    history: 'History'
  };

  useEffect(() => {
    generateFlashcards();
  }, [subject, topic]);

  const generateFlashcards = async () => {
    setLoading(true);
    if (!subject || !topic) {
      setFlashcards([]);
      setLoading(false);
      return;
    }
    try {
      const gradeLevel = 10; // You can get this from profile context if needed
      const learningStyle = 'text'; // You can get this from profile context if needed
      const difficulty = 'medium'; // You can get this from profile context if needed

      const lessonData = await generatePersonalizedLesson({
        topic,
        subject: subjectNames[subject] || subject,
        gradeLevel,
        learningStyle,
        difficulty
      });

      // Parse flashcards from lessonData.flashcards string
      // Assuming flashcards are separated by new lines and each flashcard is "Q: ... A: ..."
      const flashcardLines = lessonData.flashcards.split('\n').filter(line => line.trim() !== '');
      const parsedFlashcards: Flashcard[] = [];
      let idCounter = 1;
      for (let i = 0; i < flashcardLines.length; i += 2) {
        const questionLine = flashcardLines[i] || '';
        const answerLine = flashcardLines[i + 1] || '';
        const question = questionLine.replace(/^Q:\s*/, '').trim();
        const answer = answerLine.replace(/^A:\s*/, '').trim();
        if (question && answer) {
          parsedFlashcards.push({ id: idCounter++, question, answer });
        }
      }

      setFlashcards(parsedFlashcards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setFlashcards([]);
    }
    setLoading(false);
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const markAsCompleted = () => {
    setCompletedCards(prev => new Set(prev).add(flashcards[currentCard].id));
  };

  const resetProgress = () => {
    setCompletedCards(new Set());
    setCurrentCard(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              to={`/learn/${subject}`}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Learn
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Flashcards: {decodeURIComponent(topic || '')}
              </h1>
              <p className="text-gray-600 mt-1">
                {subjectNames[subject || 'math']} • {completedCards.size}/{flashcards.length} completed
              </p>
            </div>
          </div>
          
          <button
            onClick={resetProgress}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((completedCards.size / flashcards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCards.size / flashcards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <div 
            className={`relative w-full h-80 cursor-pointer transition-transform duration-500 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of card */}
            <div className="absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex flex-col justify-center items-center backface-hidden">
              <div className="flex items-center mb-4">
                <Brain className="text-blue-600 mr-2" size={24} />
                <span className="text-blue-600 font-medium">Question</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
                {flashcards[currentCard]?.question}
              </h2>
              <p className="text-gray-500 text-sm text-center">Click to reveal answer</p>
            </div>

            {/* Back of card */}
            <div 
              className="absolute inset-0 bg-blue-50 rounded-xl shadow-lg border border-blue-200 p-8 flex flex-col justify-center items-center backface-hidden rotate-y-180"
            >
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-600 mr-2" size={24} />
                <span className="text-green-600 font-medium">Answer</span>
              </div>
              <p className="text-lg text-gray-900 text-center mb-4">
                {flashcards[currentCard]?.answer}
              </p>
              <p className="text-gray-500 text-sm text-center">Click to see question again</p>
            </div>
          </div>
        </div>

        {/* Card Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevCard}
            disabled={flashcards.length <= 1}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {currentCard + 1} of {flashcards.length}
            </span>
            
            {!completedCards.has(flashcards[currentCard]?.id) && (
              <button
                onClick={markAsCompleted}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={20} className="mr-2" />
                Mark Complete
              </button>
            )}
            
            {completedCards.has(flashcards[currentCard]?.id) && (
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle size={16} className="mr-1" />
                Completed
              </span>
            )}
          </div>

          <button
            onClick={nextCard}
            disabled={flashcards.length <= 1}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>

        {/* All Completed */}
        {completedCards.size === flashcards.length && flashcards.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              You've completed all flashcards for {decodeURIComponent(topic || '')}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetProgress}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Review Again
              </button>
              <Link
                to={`/quiz/${subject}/${topic}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Quiz
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Flashcards;
