import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const RightSidebarAI = () => {
  const { aiSidebarOpen, setAiSidebarOpen } = useAuth();

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <AnimatePresence>
        {!aiSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAiSidebarOpen(true)}
            className="fixed bottom-6 right-6 z-[1999] w-16 h-16 rounded-full bg-gradient-to-br from-regenesys-purple to-indigo-800 text-white shadow-premium-2xl flex items-center justify-center border-2 border-white/20 backdrop-blur-md"
          >
            <Sparkles size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side Panel Overlay & Content */}
      <AnimatePresence>
        {aiSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-[400px] h-[100dvh] sm:h-[650px] max-h-[100dvh] sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-premium-2xl sm:border border-gray-100 flex flex-col z-[2000] overflow-hidden origin-bottom-right"
            >
              {/* Header - Premium Gradient */}
              <div className="p-7 bg-gradient-to-br from-regenesys-purple to-indigo-800 text-white relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-regenesys-gold/10 rounded-full -ml-12 -mb-12 blur-2xl" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      P
                    </div>
                    <div>
                      <h3 className="text-[18px] font-black tracking-tight leading-tight">Regenesys PrivateGPT</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-regenesys-gold animate-pulse" />
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Enterprise AI Assistant</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAiSidebarOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all hover:scale-110 active:scale-90"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Embedded Vercel Chatbot */}
              <iframe
                src="https://private-gpt-tool.vercel.app/"
                className="flex-1 w-full h-full border-none"
                title="Regenesys PrivateGPT"
                allow="microphone"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default RightSidebarAI;
