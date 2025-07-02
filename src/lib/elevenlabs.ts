const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

if (!ELEVENLABS_API_KEY) {
  console.warn('ElevenLabs API key not found. Voice features will be simulated.');
}

export async function generateSpeech(text: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB'): Promise<string | null> {
  if (!ELEVENLABS_API_KEY) {
    // Return null for simulation mode
    return null;
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text.replace(/[#*]/g, ''), // Remove markdown formatting
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return null;
  }
}

export async function playTextToSpeech(text: string): Promise<void> {
  const audioUrl = await generateSpeech(text);
  
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  } else {
    // Fallback: Use browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*]/g, ''));
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }
}