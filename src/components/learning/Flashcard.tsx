import { useState } from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface FlashcardProps {
  flashcard: { front: string; back: string };
  onNext: () => void;
}

export function Flashcard({ flashcard, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [confidence, setConfidence] = useState<'easy' | 'medium' | 'hard' | null>(null);

  const handleConfidenceSelect = (level: 'easy' | 'medium' | 'hard') => {
    setConfidence(level);
    setTimeout(() => {
      onNext();
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Review</h2>
        <p className="text-gray-600">Test your understanding with this flashcard</p>
      </div>

      <div className="mb-8">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="bg-white rounded-xl border-2 border-gray-200 p-8 cursor-pointer hover:border-blue-300 transition-all duration-300 min-h-[300px] flex items-center justify-center"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="text-center"
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div className="text-lg font-medium text-gray-800 mb-4">
              {isFlipped ? flashcard.back : flashcard.front}
            </div>
            <div className="text-sm text-gray-500">
              {isFlipped ? 'Answer' : 'Tap to reveal answer'}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </span>
          </button>
        </div>
      </div>

      {isFlipped && !confidence && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            How confident do you feel about this concept?
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleConfidenceSelect('hard')}
              className="bg-red-50 border-2 border-red-200 text-red-700 py-4 rounded-lg font-semibold hover:bg-red-100 transition-colors"
            >
              😰 Need Review
            </button>
            <button
              onClick={() => handleConfidenceSelect('medium')}
              className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 py-4 rounded-lg font-semibold hover:bg-yellow-100 transition-colors"
            >
              🤔 Getting There
            </button>
            <button
              onClick={() => handleConfidenceSelect('easy')}
              className="bg-green-50 border-2 border-green-200 text-green-700 py-4 rounded-lg font-semibold hover:bg-green-100 transition-colors"
            >
              😊 Confident
            </button>
          </div>
        </div>
      )}

      {confidence && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-2xl mb-2">
            {confidence === 'easy' ? '🎉' : confidence === 'medium' ? '💪' : '📚'}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {confidence === 'easy' ? 'Great job!' : 
             confidence === 'medium' ? 'Keep practicing!' : 
             'We\'ll review this again!'}
          </h3>
          <p className="text-gray-600">Moving to a quick quiz...</p>
        </div>
      )}
    </div>
  );
}