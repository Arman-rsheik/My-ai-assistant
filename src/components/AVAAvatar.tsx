import { useState, useEffect } from 'react';

interface AVAAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  emotion?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AVAAvatar({ isSpeaking, isListening, emotion = 'neutral', size = 'lg' }: AVAAvatarProps) {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40 md:w-52 md:h-52',
  };

  const emotionColors: Record<string, { primary: string; secondary: string; glow: string }> = {
    neutral: { primary: '#00e5ff', secondary: '#b388ff', glow: 'rgba(0,229,255,0.3)' },
    happy: { primary: '#69f0ae', secondary: '#ffff00', glow: 'rgba(105,240,174,0.3)' },
    sad: { primary: '#80cbc4', secondary: '#4dd0e1', glow: 'rgba(128,203,196,0.3)' },
    angry: { primary: '#ff5252', secondary: '#ff8a80', glow: 'rgba(255,82,82,0.3)' },
    loving: { primary: '#ff80ab', secondary: '#ea80fc', glow: 'rgba(255,128,171,0.3)' },
    anxious: { primary: '#ffe57f', secondary: '#ffd740', glow: 'rgba(255,229,127,0.3)' },
    tired: { primary: '#90a4ae', secondary: '#78909c', glow: 'rgba(144,164,174,0.3)' },
    motivated: { primary: '#ffd740', secondary: '#ff6d00', glow: 'rgba(255,215,64,0.3)' },
    thoughtful: { primary: '#b388ff', secondary: '#7c4dff', glow: 'rgba(179,136,255,0.3)' },
    curious: { primary: '#40c4ff', secondary: '#18ffff', glow: 'rgba(64,196,255,0.3)' },
  };

  const colors = emotionColors[emotion] || emotionColors.neutral;
  const barsCount = 24;

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Outer rotating ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid transparent`,
          borderTopColor: colors.primary,
          borderRightColor: 'transparent',
          borderBottomColor: colors.secondary,
          borderLeftColor: 'transparent',
          animation: 'ring-rotate 3s linear infinite',
          opacity: isSpeaking || isListening ? 1 : 0.5,
        }}
      />

      {/* Inner rotating ring (reverse) */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '8%',
          border: `1px solid transparent`,
          borderTopColor: 'transparent',
          borderRightColor: colors.primary,
          borderBottomColor: 'transparent',
          borderLeftColor: colors.secondary,
          animation: 'ring-rotate-reverse 2s linear infinite',
          opacity: isSpeaking || isListening ? 0.8 : 0.3,
        }}
      />

      {/* Core glow */}
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          inset: '20%',
          background: `radial-gradient(circle, ${colors.glow}, transparent 70%)`,
          filter: `blur(${isSpeaking ? 15 : isListening ? 12 : 8}px)`,
          opacity: isSpeaking ? 0.9 : isListening ? 0.7 : 0.4,
        }}
      />

      {/* Audio visualization bars */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: barsCount }).map((_, i) => {
          const angle = (i / barsCount) * 360;
          const isActive = isSpeaking || isListening;
          const barHeight = isActive
            ? 8 + Math.sin((pulsePhase + i * 15) * Math.PI / 180) * 12
            : 4 + Math.sin((pulsePhase * 0.3 + i * 15) * Math.PI / 180) * 2;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: size === 'lg' ? '2px' : '1.5px',
                height: `${barHeight}px`,
                background: `linear-gradient(to top, ${colors.primary}, ${colors.secondary})`,
                transform: `rotate(${angle}deg) translateY(-${size === 'lg' ? 38 : size === 'md' ? 26 : 14}px)`,
                opacity: isActive ? 0.8 : 0.3,
                transition: 'height 0.1s, opacity 0.3s',
                borderRadius: '1px',
              }}
            />
          );
        })}
      </div>

      {/* Center orb */}
      <div
        className="relative rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          width: '40%',
          height: '40%',
          background: `radial-gradient(circle at 30% 30%, ${colors.primary}40, ${colors.secondary}20, transparent)`,
          border: `1px solid ${colors.primary}50`,
          boxShadow: `0 0 ${isSpeaking ? 30 : 15}px ${colors.glow}`,
        }}
      >
        {/* Eye / Core indicator */}
        <div
          className="rounded-full transition-all duration-300"
          style={{
            width: isListening ? '50%' : '30%',
            height: isListening ? '50%' : '30%',
            background: colors.primary,
            boxShadow: `0 0 15px ${colors.primary}`,
            opacity: 0.9,
          }}
        />
      </div>

      {/* Status indicator */}
      {(isSpeaking || isListening) && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest uppercase"
          style={{ color: colors.primary, fontSize: '9px' }}
        >
          {isListening ? '● LISTENING' : '◉ SPEAKING'}
        </div>
      )}
    </div>
  );
}
