import { motion } from 'framer-motion';
import { Mic, Loader2, Volume2, MicOff } from 'lucide-react';

export type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

interface StatusIndicatorProps {
  status: VoiceStatus;
}

const statusConfig = {
  idle: {
    label: 'Tap to speak',
    icon: MicOff,
    color: 'bg-muted-foreground/50',
    textColor: 'text-muted-foreground',
  },
  listening: {
    label: 'Listening...',
    icon: Mic,
    color: 'bg-status-listening',
    textColor: 'text-status-listening',
  },
  thinking: {
    label: 'Thinking...',
    icon: Loader2,
    color: 'bg-status-thinking',
    textColor: 'text-status-thinking',
  },
  speaking: {
    label: 'Speaking...',
    icon: Volume2,
    color: 'bg-status-speaking',
    textColor: 'text-status-speaking',
  },
};

export const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex items-center gap-3 px-5 py-3 neu-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.div
          className={`w-3 h-3 rounded-full ${config.color}`}
          animate={status !== 'idle' ? {
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {status !== 'idle' && (
          <motion.div
            className={`absolute inset-0 w-3 h-3 rounded-full ${config.color}`}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.label}
      </span>
      <motion.div
        animate={status === 'thinking' ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: status === 'thinking' ? Infinity : 0, ease: "linear" }}
      >
        <Icon className={`w-4 h-4 ${config.textColor}`} />
      </motion.div>
    </motion.div>
  );
};
