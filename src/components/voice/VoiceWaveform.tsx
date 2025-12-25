import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
  barCount?: number;
}

export const VoiceWaveform = ({ isActive, barCount = 5 }: VoiceWaveformProps) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className="w-1 rounded-full bg-primary"
          initial={{ height: 8 }}
          animate={isActive ? {
            height: [8, 32, 16, 40, 8],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut",
            }
          } : {
            height: 8,
            transition: { duration: 0.3 }
          }}
        />
      ))}
    </div>
  );
};
