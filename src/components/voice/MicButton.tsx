import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square } from 'lucide-react';
import { VoiceStatus } from './StatusIndicator';

interface MicButtonProps {
  status: VoiceStatus;
  onToggle: () => void;
}

export const MicButton = ({ status, onToggle }: MicButtonProps) => {
  const isActive = status === 'listening' || status === 'speaking';
  const isProcessing = status === 'thinking';

  return (
    <div className="relative">
      {/* Pulse rings when active */}
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={onToggle}
        disabled={isProcessing}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30
          ${isActive 
            ? 'bg-primary shadow-glow-primary' 
            : 'mic-button bg-card'
          }
          ${isProcessing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        `}
        whileHover={!isProcessing ? { scale: 1.05 } : {}}
        whileTap={!isProcessing ? { scale: 0.95 } : {}}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="stop"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Square className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              key="processing"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full" />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Mic className="w-8 h-8 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
