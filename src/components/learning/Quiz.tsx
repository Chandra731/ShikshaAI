import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuizProps {
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  onNext: () => void;
  onSaveScore: () => void;
}

export function Quiz({ quiz, onNext, onSaveScore }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    setTimeout(() => setShowExplanation(true), 1000);
  };

  const handleNext = () => {
    onSaveScore();
    onNext();
  };

  const isCorrect = selectedAnswer === quiz.correct;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Check</h2>
        <p className="text-gray-600">Test what you've learned</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {quiz.question}
        </h3>

        <div className="space-y-3">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={`
                w-full text-left p-4 border-2 rounded-lg transition-all
                ${showResult
                  ? index === quiz.correct
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : index === selectedAnswer && index !== quiz.correct
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-gray-50 text-gray-500'
                  : selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <>
                    {index === quiz.correct && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {index === selectedAnswer && index !== quiz.correct && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {!showResult && selectedAnswer !== null && (
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit Answer
          </button>
        )}
      </div>

      {showResult && (
        <div className={`
          bg-white rounded-xl border-2 p-6 mb-6
          ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}
        `}>
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">
              {isCorrect ? '🎉' : '🤔'}
            </div>
            <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </h3>
          </div>

          {showExplanation && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Explanation:</h4>
              <p className="text-gray-700">{quiz.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <button
              onClick={handleNext}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}