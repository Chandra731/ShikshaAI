import { useState } from 'react';
import { User, Target, Globe, Brain, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ProfileSetup() {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    grade_level: 11,
    exam_type: 'Boards',
    learning_style: 'text',
    preferred_subjects: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Profile setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade_level' ? parseInt(value) : value
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_subjects: prev.preferred_subjects.includes(subject)
        ? prev.preferred_subjects.filter(s => s !== subject)
        : [...prev.preferred_subjects, subject]
    }));
  };

  const getSubjectsForExam = () => {
    switch (formData.exam_type) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Help us personalize your learning experience for better results
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Level *
                </label>
                <select
                  name="grade_level"
                  value={formData.grade_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value={11}>Class 11</option>
                  <option value={12}>Class 12</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Goals */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Academic Goals
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Exam/Board *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'Boards', label: 'School Boards', subtitle: 'CBSE/State' },
                  { value: 'NEET', label: 'NEET', subtitle: 'Medical' },
                  { value: 'JEE', label: 'JEE', subtitle: 'Engineering' },
                  { value: 'UPSC', label: 'UPSC', subtitle: 'Civil Services' },
                ].map((exam) => (
                  <label key={exam.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="exam_type"
                      value={exam.value}
                      checked={formData.exam_type === exam.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`
                      p-4 border-2 rounded-lg text-center transition-all hover:border-blue-300
                      ${formData.exam_type === exam.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                      }
                    `}>
                      <div className="font-semibold text-gray-800">{exam.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{exam.subtitle}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Preferred Subjects
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select subjects you want to focus on (based on your target exam)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getSubjectsForExam().map((subject) => (
                <label key={subject} className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferred_subjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="sr-only"
                  />
                  <div className={`
                    p-3 border-2 rounded-lg text-center transition-all hover:border-blue-300
                    ${formData.preferred_subjects.includes(subject)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                    }
                  `}>
                    <div className="font-medium">{subject}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Learning Style */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Learning Style
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              How do you prefer to learn new concepts?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { value: 'visual', icon: '👀', label: 'Visual', desc: 'Images & diagrams' },
                { value: 'audio', icon: '🎧', label: 'Audio', desc: 'Voice explanations' },
                { value: 'text', icon: '📝', label: 'Text', desc: 'Reading & writing' },
              ].map((style) => (
                <label key={style.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="learning_style"
                    value={style.value}
                    checked={formData.learning_style === style.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`
                    p-4 border-2 rounded-lg text-center transition-all hover:border-blue-300
                    ${formData.learning_style === style.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                    }
                  `}>
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-medium text-gray-800">{style.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{style.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.full_name || formData.preferred_subjects.length === 0}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
          >
            {loading ? 'Setting up your profile...' : 'Complete Setup & Start Learning'}
          </button>
        </form>
      </div>
    </div>
  );
}