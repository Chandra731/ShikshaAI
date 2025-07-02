import { useState, useEffect } from 'react';
import { X, Clock, BookOpen, Brain, Play, Target } from 'lucide-react';
import { generateRoadmap } from '../../lib/groq';
import { LearningSession } from './LearningSession';
import { supabase } from '../../lib/supabase';

interface ChapterModalProps {
  subject: string;
  profile: any;
  onClose: () => void;
}

export function ChapterModal({ subject, profile, onClose }: ChapterModalProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [targetDays, setTargetDays] = useState<number>(7);
  const [roadmap, setRoadmap] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    fetchChapters();
  }, [subject, profile]);

  const fetchChapters = async () => {
    try {
      // Try to fetch from syllabus table first
      const { data: syllabusData, error } = await supabase
        .from('syllabus')
        .select('*')
        .eq('class', profile?.grade_level?.toString())
        .eq('subject', subject)
        .order('order');

      if (syllabusData && syllabusData.length > 0) {
        setChapters(syllabusData);
      } else {
        // Fallback to predefined chapters
        setChapters(getDefaultChapters());
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setChapters(getDefaultChapters());
    }
  };

  const getDefaultChapters = () => {
    const chaptersBySubject: { [key: string]: any[] } = {
      'Physics': [
        { chapter_name: 'Physical World and Measurement', chapter_id: 'phy_01', order: 1 },
        { chapter_name: 'Kinematics', chapter_id: 'phy_02', order: 2 },
        { chapter_name: 'Laws of Motion', chapter_id: 'phy_03', order: 3 },
        { chapter_name: 'Work, Energy and Power', chapter_id: 'phy_04', order: 4 },
        { chapter_name: 'Motion of System of Particles and Rigid Body', chapter_id: 'phy_05', order: 5 },
        { chapter_name: 'Gravitation', chapter_id: 'phy_06', order: 6 },
        { chapter_name: 'Properties of Bulk Matter', chapter_id: 'phy_07', order: 7 },
        { chapter_name: 'Thermodynamics', chapter_id: 'phy_08', order: 8 },
        { chapter_name: 'Behaviour of Perfect Gas and Kinetic Theory', chapter_id: 'phy_09', order: 9 },
        { chapter_name: 'Oscillations and Waves', chapter_id: 'phy_10', order: 10 }
      ],
      'Chemistry': [
        { chapter_name: 'Some Basic Concepts of Chemistry', chapter_id: 'chem_01', order: 1 },
        { chapter_name: 'Structure of Atom', chapter_id: 'chem_02', order: 2 },
        { chapter_name: 'Classification of Elements and Periodicity', chapter_id: 'chem_03', order: 3 },
        { chapter_name: 'Chemical Bonding and Molecular Structure', chapter_id: 'chem_04', order: 4 },
        { chapter_name: 'States of Matter', chapter_id: 'chem_05', order: 5 },
        { chapter_name: 'Thermodynamics', chapter_id: 'chem_06', order: 6 },
        { chapter_name: 'Equilibrium', chapter_id: 'chem_07', order: 7 },
        { chapter_name: 'Redox Reactions', chapter_id: 'chem_08', order: 8 },
        { chapter_name: 'Hydrogen', chapter_id: 'chem_09', order: 9 },
        { chapter_name: 'The s-Block Elements', chapter_id: 'chem_10', order: 10 }
      ],
      'Mathematics': [
        { chapter_name: 'Sets', chapter_id: 'math_01', order: 1 },
        { chapter_name: 'Relations and Functions', chapter_id: 'math_02', order: 2 },
        { chapter_name: 'Trigonometric Functions', chapter_id: 'math_03', order: 3 },
        { chapter_name: 'Principle of Mathematical Induction', chapter_id: 'math_04', order: 4 },
        { chapter_name: 'Complex Numbers and Quadratic Equations', chapter_id: 'math_05', order: 5 },
        { chapter_name: 'Linear Inequalities', chapter_id: 'math_06', order: 6 },
        { chapter_name: 'Permutations and Combinations', chapter_id: 'math_07', order: 7 },
        { chapter_name: 'Binomial Theorem', chapter_id: 'math_08', order: 8 },
        { chapter_name: 'Sequences and Series', chapter_id: 'math_09', order: 9 },
        { chapter_name: 'Straight Lines', chapter_id: 'math_10', order: 10 }
      ],
      'Biology': [
        { chapter_name: 'The Living World', chapter_id: 'bio_01', order: 1 },
        { chapter_name: 'Biological Classification', chapter_id: 'bio_02', order: 2 },
        { chapter_name: 'Plant Kingdom', chapter_id: 'bio_03', order: 3 },
        { chapter_name: 'Animal Kingdom', chapter_id: 'bio_04', order: 4 },
        { chapter_name: 'Morphology of Flowering Plants', chapter_id: 'bio_05', order: 5 },
        { chapter_name: 'Anatomy of Flowering Plants', chapter_id: 'bio_06', order: 6 },
        { chapter_name: 'Structural Organisation in Animals', chapter_id: 'bio_07', order: 7 },
        { chapter_name: 'Cell: The Unit of Life', chapter_id: 'bio_08', order: 8 },
        { chapter_name: 'Biomolecules', chapter_id: 'bio_09', order: 9 },
        { chapter_name: 'Cell Cycle and Cell Division', chapter_id: 'bio_10', order: 10 }
      ]
    };

    return chaptersBySubject[subject] || [
      { chapter_name: 'Introduction to ' + subject, chapter_id: 'intro_01', order: 1 },
      { chapter_name: 'Fundamental Concepts', chapter_id: 'fund_02', order: 2 },
      { chapter_name: 'Advanced Topics', chapter_id: 'adv_03', order: 3 },
      { chapter_name: 'Applications', chapter_id: 'app_04', order: 4 },
      { chapter_name: 'Problem Solving', chapter_id: 'prob_05', order: 5 }
    ];
  };

  const generateChapterRoadmap = async () => {
    if (!selectedChapter) return;
    
    setLoading(true);
    try {
      const generatedRoadmap = await generateRoadmap(subject, selectedChapter, targetDays, profile);
      setRoadmap(generatedRoadmap);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setRoadmap('Unable to generate roadmap. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const startLearning = () => {
    setShowLearning(true);
  };

  if (showLearning) {
    return (
      <LearningSession
        subject={subject}
        chapter={selectedChapter}
        roadmap={roadmap}
        profile={profile}
        onClose={onClose}
        onBack={() => setShowLearning(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{subject}</h2>
            <p className="text-gray-600 mt-1">Choose a chapter to begin your learning journey</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!roadmap ? (
            <div className="space-y-8">
              {/* Chapter Selection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Select Chapter to Study
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.chapter_id}
                      onClick={() => setSelectedChapter(chapter.chapter_name)}
                      className={`
                        p-4 text-left border-2 rounded-xl transition-all hover:shadow-md
                        ${selectedChapter === chapter.chapter_name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 mb-1">
                            Chapter {chapter.order}: {chapter.chapter_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Interactive lessons • AI explanations • Practice quizzes
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{chapter.order}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Selection */}
              {selectedChapter && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    How many days do you want to complete this chapter?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="3"
                        max="21"
                        value={targetDays}
                        onChange={(e) => setTargetDays(Number(e.target.value))}
                        className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold min-w-[80px] text-center">
                        {targetDays} days
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="text-gray-600">
                        <div className="font-medium">3-7 days</div>
                        <div>Intensive</div>
                      </div>
                      <div className="text-gray-600">
                        <div className="font-medium">8-14 days</div>
                        <div>Balanced</div>
                      </div>
                      <div className="text-gray-600">
                        <div className="font-medium">15-21 days</div>
                        <div>Comprehensive</div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <strong>AI will create a personalized roadmap</strong> based on your timeline, learning style ({profile?.learning_style}), and {profile?.exam_type} exam requirements.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Roadmap Button */}
              {selectedChapter && (
                <button
                  onClick={generateChapterRoadmap}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Generating Your Personalized Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      <span>Generate {targetDays}-Day Learning Roadmap</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Roadmap Display */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Your {targetDays}-Day Learning Roadmap
                    </h3>
                    <p className="text-gray-600">{subject} - {selectedChapter}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                    {roadmap}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setRoadmap('');
                    setSelectedChapter('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Choose Different Chapter
                </button>
                <button
                  onClick={startLearning}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Learning Journey</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}