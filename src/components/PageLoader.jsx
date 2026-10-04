import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 40;
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
  const size = Math.random() * 5 + 1.5;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const duration = Math.random() * 10 + 8;
  const delay = Math.random() * 4;
  return { id: i, size, initialX, initialY, duration, delay };
});

function GoldenSaffronDust() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.initialX}vw`, y: `${p.initialY}vh` }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            x: [`${p.initialX}vw`, `${p.initialX + 25}vw`],
            y: [`${p.initialY}vh`, `${p.initialY - 30}vh`],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          className="absolute rounded-full bg-amber-400 shadow-[0_0_12px_3px_rgba(245,158,11,0.9)] blur-[0.5px]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

const quotes = [
  "Promise of Purity in Every Grain.",
  "Direct from Certified Organic Farms.",
  "100% Natural, Zero Preservatives.",
  "Handpicked Kashmiri Saffron & Gourmet Nuts.",
  "Nourishing Wellness for Your Family."
];

export default function PageLoader({ onFinish, skip, dataReady }) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasTapped, setHasTapped] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  if (skip) return null;

  useEffect(() => {
    if (!hasTapped) return;

    // Cycle quotes every 1.5s
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 1500);

    // 6-second loader timer
    const LOADER_DURATION = 6000;
    
    // Simulate progress over 6 seconds
    const intervalTime = 50;
    const progressStep = 100 / (LOADER_DURATION / intervalTime);
    
    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        return p + progressStep;
      });
    }, intervalTime);

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setIsVisible(false);
      if (onFinish) onFinish();
    };

    const finishTimer = setTimeout(dismiss, LOADER_DURATION);

    return () => {
      clearInterval(quoteTimer);
      clearInterval(progressTimer);
      clearTimeout(finishTimer);
    };
  }, [hasTapped, onFinish]);

  const handleInitialTap = () => {
    if (!hasTapped) {
      setHasTapped(true);
    }
  };

  const handleSkip = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    if (onFinish) onFinish();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)", transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[500] flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#3b1c06] via-[#5c3110] to-[#120a05] overflow-hidden"
          onClick={handleInitialTap}
        >
          {/* Glowing Amber Aura */}
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f59e0b] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d97706] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          </div>

          {hasTapped && <GoldenSaffronDust />}

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
            {/* Fortune Foodz Animated Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-4"
            >
              <motion.div
                animate={{ scale: [1, 1.03, 1], y: [0, -6, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]"
              >
                <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center p-4 bg-white rounded-full border-4 border-amber-400 shadow-2xl">
                  <img src="/logo.png" alt="Fortune Foodz Logo" className="w-full h-full object-contain relative z-10" />
                </div>
              </motion.div>
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl md:text-5xl font-cinzel font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mb-2 drop-shadow-md"
            >
              FORTUNE FOODZ
            </motion.h1>

            {!hasTapped ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex flex-col items-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="px-8 py-3 bg-amber-500/20 border border-amber-400/50 rounded-full text-amber-200 font-bold tracking-[0.2em] text-sm md:text-base drop-shadow-lg shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  TAP TO START
                </motion.div>
                <p className="mt-4 text-amber-200/50 text-xs tracking-widest uppercase">
                  Turn on your volume for the best experience
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-full"
              >
                <p className="text-xs md:text-sm font-bold tracking-widest text-[#2563eb] uppercase mb-4 mt-2">
                  PROMISE OF PURITY
                </p>

                {/* Cycling Quotes */}
                <div className="h-6 mb-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-amber-200/90 text-sm md:text-base italic font-medium tracking-wide"
                    >
                      "{quotes[quoteIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-64 md:w-80 mb-8 flex flex-col items-center gap-2">
                  <div className="h-2 w-full bg-stone-900/60 rounded-full overflow-hidden relative border border-amber-500/30">
                    <div
                      style={{ width: `${progress}%` }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)] transition-all duration-75"
                    />
                  </div>
                  <div className="text-amber-200/70 text-xs font-mono tracking-widest font-bold">
                    LOADING {Math.floor(progress)}%
                  </div>
                </div>

                {/* Skip Button */}
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="px-6 py-2 bg-transparent border-b border-amber-400/40 text-amber-200/60 font-medium tracking-wider uppercase text-xs hover:text-amber-200 transition-all"
                  onClick={handleSkip}
                >
                  Skip
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
