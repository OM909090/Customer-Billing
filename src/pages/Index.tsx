import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicButton } from '@/components/voice/MicButton';
import { StatusIndicator, VoiceStatus } from '@/components/voice/StatusIndicator';
import { VoiceWaveform } from '@/components/voice/VoiceWaveform';
import { ChatMessage, Message } from '@/components/voice/ChatMessage';
import { Zap, TrendingUp, Users, Calendar } from 'lucide-react';

// Demo messages for UI showcase
const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hi! I\'m your billing assistant. Just say a customer name and amount, like "Santa 50 rupees", and I\'ll record it instantly.',
    timestamp: new Date(Date.now() - 300000),
  },
];

const demoResponses = [
  { user: "Santa 50 rupees", ai: "Got it! Added ₹50 charge for Santa. Today's total for Santa: ₹150" },
  { user: "Ramesh total", ai: "Ramesh has a total of ₹2,450 across 18 transactions this month." },
  { user: "Today's summary", ai: "Today you've recorded 12 transactions totaling ₹1,850 across 8 customers." },
];

const Index = () => {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [demoIndex, setDemoIndex] = useState(0);

  const handleToggleVoice = useCallback(() => {
    if (status === 'idle') {
      setStatus('listening');
      
      // Simulate voice flow
      setTimeout(() => {
        setStatus('thinking');
        
        const demo = demoResponses[demoIndex % demoResponses.length];
        
        // Add user message
        const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: demo.user,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        
        setTimeout(() => {
          setStatus('speaking');
          
          // Add AI response
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: demo.ai,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMsg]);
          
          setTimeout(() => {
            setStatus('idle');
            setDemoIndex(prev => prev + 1);
          }, 2000);
        }, 1500);
      }, 2000);
    } else if (status === 'listening' || status === 'speaking') {
      setStatus('idle');
    }
  }, [status, demoIndex]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header 
        className="px-6 py-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Customer Billing</h1>
            <p className="text-xs text-muted-foreground">Voice-first billing</p>
          </div>
        </div>
        <StatusIndicator status={status} />
      </motion.header>

      {/* Quick Stats */}
      <motion.div 
        className="px-6 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: TrendingUp, label: "Today", value: "₹1,850" },
            { icon: Users, label: "Customers", value: "8" },
            { icon: Calendar, label: "Month", value: "₹24.5K" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="neu-card px-3 py-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <stat.icon className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="space-y-4 max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Voice Control Area */}
      <motion.div 
        className="px-6 py-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <div className="max-w-md mx-auto">
          {/* Waveform Container */}
          <motion.div 
            className="neu-card-inset rounded-3xl p-6 mb-6"
            animate={status === 'listening' || status === 'speaking' ? {
              boxShadow: [
                'inset 4px 4px 8px hsl(220 20% 82%), inset -4px -4px 8px hsl(220 20% 100%)',
                'inset 4px 4px 8px hsl(245 80% 50% / 0.2), inset -4px -4px 8px hsl(220 20% 100%)',
                'inset 4px 4px 8px hsl(220 20% 82%), inset -4px -4px 8px hsl(220 20% 100%)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <VoiceWaveform isActive={status === 'listening' || status === 'speaking'} barCount={7} />
            
            {/* Hint Text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={status}
                className="text-center text-sm text-muted-foreground mt-4"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {status === 'idle' && 'Try saying "Santa 50 rupees"'}
                {status === 'listening' && 'I\'m listening...'}
                {status === 'thinking' && 'Processing your request...'}
                {status === 'speaking' && 'Here\'s what I found...'}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Mic Button */}
          <div className="flex justify-center">
            <MicButton status={status} onToggle={handleToggleVoice} />
          </div>

          {/* Active Hours Notice */}
          <motion.p 
            className="text-center text-xs text-muted-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Voice active 3:00 AM – 12:00 PM • Auto-export at noon
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
