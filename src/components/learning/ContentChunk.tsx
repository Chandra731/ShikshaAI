import { useState } from 'react';
import { Volume2, MessageCircle, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ContentChunkProps {
  content: string;
  onNext: () => void;
  onPlayAudio: () => void;
  voiceEnabled: boolean;
}

export function ContentChunk({ content, onNext, onPlayAudio, voiceEnabled }: ContentChunkProps) {
  const [userFeedback, setUserFeedback] = useState<'understood' | 'confused' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedback = (feedback: 'understood' | 'confused') => {
    setUserFeedback(feedback);
    setShowFeedback(true);
    
    // Auto-advance after feedback
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <div className="prose max-w-none">
          <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
            {content}
          </div>
        </div>
        
        {voiceEnabled && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onPlayAudio}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              <span className="text-sm font-medium">Play Audio</span>
            </button>
          </div>
        )}
      </div>

      {!showFeedback ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center mb-6">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              How are you feeling about this concept?
            </h3>
            <p className="text-gray-600">
              Your feedback helps us adapt the learning experience
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => handleFeedback('understood')}
              className="flex-1 bg-green-50 border-2 border-green-200 text-green-700 py-4 rounded-lg font-semibold hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Got it! 👍</span>
            </button>
            <button
              onClick={() => handleFeedback('confused')}
              className="flex-1 bg-orange-50 border-2 border-orange-200 text-orange-700 py-4 rounded-lg font-semibold hover:bg-orange-100 transition-colors flex items-center justify-center space-x-2"
            >
              <ThumbsDown className="w-5 h-5" />
              <span>Need more help 🤔</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center">
            {userFeedback === 'understood' ? (
              <div className="text-green-600">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-semibold mb-2">Excellent!</h3>
                <p className="text-gray-600">Moving on to a quick flashcard review...</p>
              </div>
            ) : (
              <div className="text-orange-600">
                <div className="text-4xl mb-2">💡</div>
                <h3 className="text-lg font-semibold mb-2">No worries!</h3>
                <p className="text-gray-600">We'll reinforce this with practice questions...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}