
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// Utility functions for audio decoding as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AiExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'th-TH'; // Primary Thai transcription support
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    setSources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on the biological study of love (Lust, Attraction, Attachment) and modern neuroscience, explain this specifically: ${query}. Provide a concise, insightful answer in Thai.`,
        config: {
          systemInstruction: "You are a neuroscientist. Use the context of Testosterone, Estrogen, Dopamine, Serotonin, Oxytocin, and Vasopressin. Use Google Search to ensure the information is up-to-date with current scientific trends.",
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
        }
      });
      
      setResponse(result.text || "No response found.");
      
      // Extract grounding sources
      const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        // Filter out duplicates and ensure valid web URIs
        const uniqueSources = Array.from(new Set(
          groundingChunks
            .filter((chunk: any) => chunk.web && chunk.web.uri)
            .map((chunk: any) => JSON.stringify({ title: chunk.web.title, uri: chunk.web.uri }))
        )).map((s: any) => JSON.parse(s));
        setSources(uniqueSources);
      }

    } catch (err) {
      setResponse("Error connecting to neural network.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = async () => {
    if (!response || isSpeaking) return;
    setIsSpeaking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this scientific explanation clearly: ${response}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="mt-12 bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-pink-500">Neuro-Bot</span> 
        <span className="text-slate-400 font-light">| Research Grounded</span>
      </h2>
      
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask about dating trends or the biology of love..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-4 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none placeholder:text-slate-500 transition-all"
          />
          <button
            onClick={toggleListening}
            title="Voice Input"
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
              isListening ? 'bg-pink-600 text-white animate-pulse' : 'text-slate-400 hover:text-pink-400 hover:bg-slate-700'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
        </div>
        <button
          onClick={handleAsk}
          disabled={loading || !query.trim()}
          className="bg-pink-600 hover:bg-pink-500 disabled:bg-slate-700 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-pink-900/20 active:scale-95"
        >
          {loading ? 'Analyzing...' : 'Ask Scientist'}
        </button>
      </div>

      {(loading || response) && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 relative group">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
            <>
              <div className="text-slate-200 leading-relaxed font-thai whitespace-pre-wrap pr-10 mb-4">
                {response}
              </div>
              
              {sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Sources & References</h4>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-1 rounded hover:border-pink-500/50 text-slate-400 hover:text-pink-400 transition-colors inline-flex items-center gap-1"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
                        {source.title || 'Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={speakResponse}
                disabled={isSpeaking}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
                  isSpeaking ? 'bg-indigo-600 text-white animate-bounce' : 'text-slate-500 hover:text-indigo-400 hover:bg-slate-700 opacity-0 group-hover:opacity-100'
                }`}
                title="Listen to response"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AiExplorer;
