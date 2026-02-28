import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, User, Brain, Zap, Settings, ChevronLeft, Menu } from 'lucide-react';
import ChatPanel from './components/ChatPanel';
import ProfilePanel from './components/ProfilePanel';
import MemoriesPanel from './components/MemoriesPanel';
import AVAAvatar from './components/AVAAvatar';

type Tab = 'chat' | 'profile' | 'memories' | 'about';

const tabs = [
  { id: 'chat' as Tab, label: 'Chat', icon: <MessageCircle size={20} />, desc: 'Talk with AVA' },
  { id: 'profile' as Tab, label: 'Profile', icon: <User size={20} />, desc: 'Your info' },
  { id: 'memories' as Tab, label: 'Memories', icon: <Brain size={20} />, desc: 'Memory bank' },
  { id: 'about' as Tab, label: 'System', icon: <Settings size={20} />, desc: 'About AVA' },
];

function ParticleField() {
  const particles = Array.from({ length: 40 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px rounded-full"
          style={{
            background: i % 3 === 0 ? '#00e5ff' : i % 3 === 1 ? '#b388ff' : '#ff80ab',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 200],
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

function HexGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="0.5"
            />
            <path
              d="M28 0L56 16L56 50L28 66L0 50L0 16"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

function ScanLine() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <div
        className="absolute left-0 right-0 h-[2px] animate-scan-line"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.08), transparent)',
        }}
      />
    </div>
  );
}

function AboutPanel() {
  const features = [
    {
      icon: <MessageCircle size={20} className="text-ava-cyan" />,
      title: 'Natural Conversation',
      desc: 'Talk to AVA like a real friend. She understands context, emotions, and remembers your preferences.',
    },
    {
      icon: <Zap size={20} className="text-ava-purple" />,
      title: 'Voice Interaction',
      desc: 'Speak to AVA and hear her respond. Uses Web Speech API for natural voice communication.',
    },
    {
      icon: <Brain size={20} className="text-ava-pink" />,
      title: 'Personal Memory',
      desc: 'AVA remembers everything you tell her — your profile, updates, journal entries, and facts.',
    },
    {
      icon: <User size={20} className="text-ava-green" />,
      title: 'Emotional Intelligence',
      desc: 'AVA detects your emotions from text and responds with genuine empathy and understanding.',
    },
  ];

  const steps = [
    { step: '01', title: 'Set Up Your Profile', desc: 'Go to the Profile tab and fill in your information. The more AVA knows, the better she can be your friend.' },
    { step: '02', title: 'Start Chatting', desc: 'Open the Chat tab and start talking! Type or use the microphone button to speak.' },
    { step: '03', title: 'Add Memories', desc: 'Use the Memories tab to store updates, journal entries, reminders, and facts about your life.' },
    { step: '04', title: 'Enable Voice', desc: 'AVA can speak her responses! Toggle the speaker icon in chat to enable/disable voice output.' },
    { step: '05', title: 'Keep Updating', desc: 'The more you interact and add memories, the more personalized AVA becomes.' },
  ];

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="flex justify-center mb-6">
          <AVAAvatar isSpeaking={false} isListening={false} emotion="loving" size="lg" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-shimmer mb-3">
          Meet AVA
        </h1>
        <p className="text-base text-ava-text-dim max-w-md mx-auto">
          <strong className="text-ava-cyan">A</strong>daptive <strong className="text-ava-cyan">V</strong>irtual <strong className="text-ava-cyan">A</strong>ssistant
        </p>
        <p className="text-sm text-ava-text-dim max-w-lg mx-auto mt-3 leading-relaxed">
          Your personal AI companion who understands emotions, remembers your story,
          and is always here for you — like a best friend who never sleeps. 💜
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-bold text-ava-purple tracking-widest uppercase mb-4 flex items-center gap-2">
          <Zap size={14} /> Core Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-xl p-4 hover:border-ava-cyan/20 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5">{feat.icon}</div>
                <div>
                  <h4 className="text-sm font-semibold text-ava-text">{feat.title}</h4>
                  <p className="text-xs text-ava-text-dim mt-1 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to Use - Steps */}
      <div>
        <h3 className="text-sm font-bold text-ava-purple tracking-widest uppercase mb-4 flex items-center gap-2">
          <Settings size={14} /> How to Use AVA
        </h3>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-panel rounded-xl p-4 flex items-start gap-4 hover:border-ava-cyan/20 transition-all"
            >
              <span className="text-2xl font-bold text-ava-cyan/30 font-mono shrink-0">{s.step}</span>
              <div>
                <h4 className="text-sm font-semibold text-ava-text">{s.title}</h4>
                <p className="text-xs text-ava-text-dim mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Info */}
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-sm font-bold text-ava-purple tracking-widest uppercase mb-3">System Info</h3>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-ava-text-dim">Version</span>
            <span className="text-ava-cyan">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ava-text-dim">Engine</span>
            <span className="text-ava-cyan">AVA Core NLP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ava-text-dim">Voice</span>
            <span className="text-ava-cyan">Web Speech API</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ava-text-dim">Storage</span>
            <span className="text-ava-cyan">Local (On-Device)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ava-text-dim">Privacy</span>
            <span className="text-ava-green">100% Private — No data leaves your device</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-ava-text-dim pb-4">
        Made with 💜 — AVA is always here for you
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-ava-darker grid-bg flex overflow-hidden relative">
      {/* Background Effects */}
      <ParticleField />
      <HexGrid />
      <ScanLine />

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-24 h-24 pointer-events-none z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0 0 L30 0 L30 2 L2 2 L2 30 L0 30 Z" fill="#00e5ff" opacity="0.3" />
        </svg>
      </div>
      <div className="fixed top-0 right-0 w-24 h-24 pointer-events-none z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M100 0 L70 0 L70 2 L98 2 L98 30 L100 30 Z" fill="#00e5ff" opacity="0.3" />
        </svg>
      </div>
      <div className="fixed bottom-0 left-0 w-24 h-24 pointer-events-none z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0 100 L30 100 L30 98 L2 98 L2 70 L0 70 Z" fill="#b388ff" opacity="0.3" />
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-24 h-24 pointer-events-none z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M100 100 L70 100 L70 98 L98 98 L98 70 L100 70 Z" fill="#b388ff" opacity="0.3" />
        </svg>
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-14 glass-panel-strong z-30 flex items-center justify-between px-4 md:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-ava-text-dim">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-ava-cyan animate-pulse" />
          <span className="text-sm font-bold text-shimmer tracking-widest">A V A</span>
        </div>
        <div className="text-xs font-mono text-ava-text-dim">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative z-50 h-full w-64 md:w-20 lg:w-64 glass-panel-strong flex flex-col transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Area */}
        <div className="p-4 md:p-3 lg:p-4 border-b border-ava-border">
          <div className="flex items-center gap-3 md:justify-center lg:justify-start">
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-ava-text-dim">
              <ChevronLeft size={18} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ava-cyan/20 to-ava-purple/20 border border-ava-cyan/30 flex items-center justify-center">
              <Zap size={16} className="text-ava-cyan" />
            </div>
            <div className="md:hidden lg:block">
              <h1 className="text-sm font-bold text-shimmer tracking-[0.3em]">A V A</h1>
              <p className="text-[10px] text-ava-text-dim tracking-wider">PERSONAL AI</p>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="px-4 md:px-2 lg:px-4 py-3 border-b border-ava-border">
          <div className="flex items-center gap-2 md:justify-center lg:justify-start">
            <div className="w-2 h-2 rounded-full bg-ava-green animate-pulse" />
            <span className="text-xs text-ava-green font-mono md:hidden lg:inline">SYSTEM ONLINE</span>
          </div>
          <div className="mt-2 md:hidden lg:block">
            <p className="text-[10px] font-mono text-ava-text-dim">
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-xs font-mono text-ava-cyan">
              {time.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 md:px-2 lg:px-3 py-3 rounded-xl transition-all group ${
                activeTab === tab.id
                  ? 'bg-ava-cyan/10 text-ava-cyan border border-ava-cyan/20'
                  : 'text-ava-text-dim hover:text-ava-text hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className={`shrink-0 ${activeTab === tab.id ? '' : 'group-hover:text-ava-cyan/60'} md:mx-auto lg:mx-0`}>
                {tab.icon}
              </span>
              <div className="text-left md:hidden lg:block">
                <p className="text-sm font-medium">{tab.label}</p>
                <p className="text-[10px] text-ava-text-dim">{tab.desc}</p>
              </div>
              {activeTab === tab.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ava-cyan md:hidden lg:block" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom info */}
        <div className="p-4 md:p-2 lg:p-4 border-t border-ava-border">
          <div className="md:hidden lg:block">
            <p className="text-[10px] font-mono text-ava-text-dim leading-relaxed">
              ◈ All data stored locally
              <br />
              ◈ 100% private & secure
              <br />
              ◈ No internet required for chat
            </p>
          </div>
          <div className="hidden md:block lg:hidden text-center">
            <div className="w-2 h-2 rounded-full bg-ava-purple mx-auto" />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-20 pt-14 md:pt-0">
        {/* Top bar (desktop) */}
        <div className="hidden md:flex h-12 items-center justify-between px-6 border-b border-ava-border glass-panel-strong">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ava-cyan animate-pulse" />
              <span className="text-xs font-mono text-ava-text-dim tracking-wider uppercase">
                {tabs.find(t => t.id === activeTab)?.label} Module
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-px bg-ava-border" />
              <span className="text-xs font-mono text-ava-text-dim">
                {time.toLocaleTimeString()}
              </span>
              <div className="h-4 w-px bg-ava-border" />
              <span className="text-xs font-mono text-ava-green flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ava-green" />
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'chat' && <ChatPanel />}
              {activeTab === 'profile' && <ProfilePanel />}
              {activeTab === 'memories' && <MemoriesPanel />}
              {activeTab === 'about' && <AboutPanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom status bar */}
        <div className="hidden md:flex h-7 items-center justify-between px-6 border-t border-ava-border glass-panel-strong text-[10px] font-mono text-ava-text-dim">
          <div className="flex items-center gap-4">
            <span>AVA v1.0.0</span>
            <span>◈ LOCAL ENGINE</span>
            <span>◈ VOICE: WEB SPEECH API</span>
          </div>
          <div className="flex items-center gap-4">
            <span>PRIVACY: ON-DEVICE</span>
            <span className="text-ava-green flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-ava-green" />
              ALL SYSTEMS NOMINAL
            </span>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel-strong z-30 md:hidden border-t border-ava-border">
        <div className="flex items-center justify-around py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'text-ava-cyan'
                  : 'text-ava-text-dim'
              }`}
            >
              {tab.icon}
              <span className="text-[9px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="mobile-tab" className="w-4 h-0.5 rounded-full bg-ava-cyan mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
