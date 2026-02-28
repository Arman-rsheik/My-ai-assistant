import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Trash2 } from 'lucide-react';
import AVAAvatar from './AVAAvatar';
import {
  ChatMessage,
  loadChatHistory,
  saveChatHistory,
  loadPersonalInfo,
  loadMemories,
  generateResponse,
  speak,
  stopSpeaking,
} from '../lib/avaCore';

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const history = loadChatHistory();
    if (history.length === 0) {
      // Welcome message
      const info = loadPersonalInfo();
      const name = info.nickname || info.name || '';
      const welcome: ChatMessage = {
        id: 'welcome',
        role: 'ava',
        text: name
          ? `Hello ${name}! 💜✨ I'm AVA, your personal AI companion. I already know a bit about you, and I'm so excited to chat! You can talk to me about anything — your day, your feelings, your dreams, or just to have fun. I'm all yours! 🌟`
          : `Hello! 💜✨ I'm AVA — your Adaptive Virtual Assistant and personal AI companion. I'm here to be your friend, your confidant, and your support system. Start by heading to the Profile section to tell me about yourself, and I'll remember everything! The more I know you, the better our conversations become. Let's get started! 🌟`,
        timestamp: Date.now(),
        emotion: 'happy',
      };
      setMessages([welcome]);
      saveChatHistory([welcome]);
    } else {
      setMessages(history);
      const lastAva = [...history].reverse().find(m => m.role === 'ava');
      if (lastAva?.emotion) setCurrentEmotion(lastAva.emotion);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-send after voice input
        setTimeout(() => {
          handleSend(transcript);
        }, 300);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSend = useCallback((overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages(prev => {
      const updated = [...prev, userMsg];
      saveChatHistory(updated);
      return updated;
    });
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const info = loadPersonalInfo();
      const memories = loadMemories();
      const response = generateResponse(text, info, memories);

      const avaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ava',
        text: response.text,
        timestamp: Date.now(),
        emotion: response.emotion,
      };

      setCurrentEmotion(response.emotion);
      setIsTyping(false);

      setMessages(prev => {
        const updated = [...prev, avaMsg];
        saveChatHistory(updated);
        return updated;
      });

      // Auto speak
      if (autoSpeak) {
        setIsSpeaking(true);
        speak(response.text, () => setIsSpeaking(false));
      }
    }, delay);
  }, [input, autoSpeak]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      setIsSpeaking(false);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleAutoSpeak = () => {
    if (autoSpeak) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setAutoSpeak(!autoSpeak);
  };

  const clearChat = () => {
    const welcome: ChatMessage = {
      id: 'welcome-new',
      role: 'ava',
      text: `Chat cleared! 🌟 Fresh start, ${loadPersonalInfo().nickname || loadPersonalInfo().name || 'friend'}! I still remember everything about you though — nothing is lost. What shall we talk about? 💜`,
      timestamp: Date.now(),
      emotion: 'happy',
    };
    setMessages([welcome]);
    saveChatHistory([welcome]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const speakMessage = (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);
    speak(text, () => setIsSpeaking(false));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Avatar */}
      <div className="px-4 md:px-6 py-3 border-b border-ava-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AVAAvatar
                isSpeaking={isSpeaking}
                isListening={isListening}
                emotion={currentEmotion}
                size="sm"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ava-cyan tracking-wide">A.V.A</h2>
              <p className="text-xs text-ava-text-dim">
                {isTyping ? 'typing...' : isSpeaking ? 'speaking...' : isListening ? 'listening...' : 'online • ready'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoSpeak}
              className={`p-2 rounded-lg transition-all ${autoSpeak ? 'text-ava-cyan bg-ava-cyan/10' : 'text-ava-text-dim hover:text-ava-text'}`}
              title={autoSpeak ? 'Voice ON' : 'Voice OFF'}
            >
              {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-ava-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'ava' ? 'message-ava' : 'message-user'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold tracking-wide ${msg.role === 'ava' ? 'text-ava-cyan' : 'text-ava-purple'}`}>
                    {msg.role === 'ava' ? 'AVA' : 'YOU'}
                  </span>
                  <span className="text-xs text-ava-text-dim">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'ava' && (
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="text-ava-text-dim hover:text-ava-cyan transition-colors ml-auto"
                      title="Play audio"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-ava-text whitespace-pre-line">{msg.text}</p>
                {msg.emotion && msg.role === 'ava' && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-ava-text-dim border border-white/5">
                    mood: {msg.emotion}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="message-ava rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-ava-cyan tracking-wide">AVA</span>
                <div className="flex gap-1 ml-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-ava-cyan rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 md:px-6 py-4 border-t border-ava-border">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all shrink-0 ${
              isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : 'cyber-button'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Talk to AVA...'}
              className="cyber-input w-full px-4 py-3 rounded-xl text-sm pr-12"
              disabled={isListening}
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="cyber-button p-3 rounded-xl shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>

        {!recognitionRef.current && (
          <p className="text-xs text-ava-text-dim mt-2 text-center">
            💡 Voice input requires Chrome or Edge browser
          </p>
        )}
      </div>
    </div>
  );
}
