const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.warn('Groq API key not found. AI features will be simulated.');
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGroqAPI(messages: ChatMessage[]): Promise<string> {
  if (!GROQ_API_KEY) {
    // Simulation mode for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateSimulatedResponse(messages);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Groq API error:', error);
    return generateSimulatedResponse(messages);
  }
}

function generateSimulatedResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  if (lastMessage.includes('roadmap') || lastMessage.includes('chapter')) {
    return `## Study Roadmap Generated!

**Day 1-2: Foundation Building**
- Core concepts and definitions
- Basic problem-solving techniques
- Practice problems (Easy level)

**Day 3-4: Intermediate Concepts**
- Advanced topics and applications
- Formula derivations and proofs
- Practice problems (Medium level)

**Day 5-6: Advanced Topics**
- Complex problem-solving
- Real-world applications
- Practice problems (Hard level)

**Day 7: Revision & Assessment**
- Complete chapter review
- Mock test and evaluation
- Doubt clarification session`;
  }

  if (lastMessage.includes('explain') || lastMessage.includes('concept')) {
    return `Let me break this down for you in simple terms:

**Key Concept:** This topic is fundamental to understanding the broader subject area.

**Real-world Connection:** You can see this concept in action when you observe everyday phenomena around you.

**Remember This:** The most important thing to remember is the underlying principle that governs this concept.

Ready for the next part? 🎯`;
  }

  if (lastMessage.includes('quiz') || lastMessage.includes('question')) {
    return `## Quick Quiz Time! 🧠

**Question:** Which of the following best describes the concept we just learned?

A) Option A - Basic understanding
B) Option B - Intermediate application  
C) Option C - Advanced concept
D) Option D - All of the above

Take your time and think about what we've covered! 💭`;
  }

  return `Great question! Let me help you understand this better. 

This concept is important because it forms the foundation for more advanced topics. Think of it as building blocks - each piece helps you understand the bigger picture.

Would you like me to explain this in a different way or shall we move forward? 🚀`;
}

export async function generateRoadmap(subject: string, chapter: string, days: number, profile: any): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are an expert educational AI tutor specializing in ${profile.target_exam} preparation for ${profile.class_level}th class students. Create detailed, day-wise study roadmaps that are engaging and effective.`
    },
    {
      role: 'user',
      content: `Create a ${days}-day study roadmap for ${subject} - ${chapter}. 
      Student profile: Class ${profile.class_level}, Target: ${profile.target_exam}, Learning style: ${profile.learning_style}.
      Make it structured with daily goals, topics to cover, and practice recommendations.`
    }
  ];

  return await callGroqAPI(messages);
}

export async function generateChunkedContent(topic: string, chunkIndex: number, profile: any): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are a friendly, engaging AI tutor. Break down complex topics into digestible chunks. Use simple language, examples, and encourage interaction. Keep each chunk to 2-3 paragraphs maximum.`
    },
    {
      role: 'user',
      content: `Explain ${topic} in an engaging way (chunk ${chunkIndex + 1}). 
      Student profile: Class ${profile.class_level}, Target: ${profile.target_exam}, Learning style: ${profile.learning_style}.
      Make it conversational and ask a question at the end to check understanding.`
    }
  ];

  return await callGroqAPI(messages);
}

export async function generateFlashcard(topic: string, concept: string): Promise<{ front: string; back: string }> {
  const content = await callGroqAPI([
    {
      role: 'system',
      content: 'Create engaging flashcards with clear questions and comprehensive answers. Make them memorable and fun.'
    },
    {
      role: 'user',
      content: `Create a flashcard for ${topic} focusing on ${concept}. Format as "FRONT: question" and "BACK: answer"`
    }
  ]);

  const lines = content.split('\n');
  const front = lines.find(line => line.startsWith('FRONT:'))?.replace('FRONT:', '').trim() || `What is ${concept}?`;
  const back = lines.find(line => line.startsWith('BACK:'))?.replace('BACK:', '').trim() || `${concept} is a fundamental concept in ${topic}.`;

  return { front, back };
}

export async function generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<any> {
  const content = await callGroqAPI([
    {
      role: 'system',
      content: 'Create multiple choice questions with 4 options and explanations. Make them challenging but fair.'
    },
    {
      role: 'user',
      content: `Create a ${difficulty} level quiz question about ${topic}. Include 4 options (A, B, C, D) and the correct answer with explanation.`
    }
  ]);

  // Simplified quiz parsing for demo
  return {
    question: `Which of the following best describes ${topic}?`,
    options: [
      'Option A - Basic concept',
      'Option B - Intermediate application',
      'Option C - Advanced theory',
      'Option D - All of the above'
    ],
    correct: 1,
    explanation: content.split('\n').slice(-2).join(' ')
  };
}