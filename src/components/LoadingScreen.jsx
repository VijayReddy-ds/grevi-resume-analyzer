import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, Search, FileText, CheckCircle2 } from 'lucide-react';

const steps = [
  { text: "Reading Resume...", icon: <FileText className="w-8 h-8 text-blue-400" /> },
  { text: "Understanding Job Role...", icon: <Search className="w-8 h-8 text-indigo-400" /> },
  { text: "Analyzing Skills...", icon: <BrainCircuit className="w-8 h-8 text-purple-400" /> },
  { text: "Comparing with Industry Standards...", icon: <Sparkles className="w-8 h-8 text-pink-400" /> },
  { text: "Generating Insights...", icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" /> }
];

export default function LoadingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 5 second total animation (5 steps, 1 second each)
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1000); // Wait 1s on the last step before completing
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Circular Progress */}
      <div className="relative w-48 h-48 mb-12">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
          <motion.circle
            cx="96" cy="96" r="88"
            stroke="url(#gradient)" strokeWidth="4" fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 1000" }}
            animate={{ strokeDasharray: `${(currentStep + 1) * (553 / 5)} 1000` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {steps[currentStep].icon}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Animated Text */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentStep}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200"
        >
          {steps[currentStep].text}
        </motion.h2>
      </AnimatePresence>
      
      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-indigo-500/50 rounded-full blur-sm"
          animate={{
            y: [0, -100, 0],
            x: Math.random() * 200 - 100,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
          style={{
            left: `${40 + Math.random() * 20}%`,
            top: `${60 + Math.random() * 10}%`
          }}
        />
      ))}
    </div>
  );
}
