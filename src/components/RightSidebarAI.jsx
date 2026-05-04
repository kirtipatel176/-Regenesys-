import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestedQueries = [
  "What programmes?",
  "How to enrol?",
  "ESG Details",
  "Fee structure"
];

const RightSidebarAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm Regenesys PrivateGPT. I can answer questions about our programmes, admissions, fees, course content, and career outcomes. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = typeof text === 'string' ? text : input;
    if (!msg.trim() || isTyping) return;

    const userMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Regenesys Corporate Education offers a wide range of programmes including Role-Based training, Gen AI Academy, and ESG. We've trained over 2000+ participants across 100+ batches." 
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button (FAB) - White Style like original PrivateGPT */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-7 right-7 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-premium-xl z-[100] border border-gray-100 group"
        >
          <Sparkles size={24} className="text-regenesys-purple group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-regenesys-purple rounded-full border-2 border-white">
            <span className="absolute inset-0 bg-regenesys-purple rounded-full animate-ping opacity-40" />
          </span>
        </motion.button>
      )}

      {/* Slide-in Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.1)] flex flex-col z-[101]"
          >
            {/* Header - Dark Theme like screenshot */}
            <div className="p-6 bg-[#1a237e] text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#8bc34a] flex items-center justify-center text-white font-bold text-xl shadow-inner">
                  P
                </div>
                <div>
                  <h3 className="text-[18px] font-bold">Regenesys PrivateGPT</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Enterprise AI Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Chat Content */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center text-[#4caf50] font-bold text-[10px] shrink-0 mt-1">
                      P
                    </div>
                  )}
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#1a237e] text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center text-[#4caf50] font-bold text-[10px] shrink-0 mt-1">
                    P
                  </div>
                  <div className="bg-white border border-gray-100 px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Suggested & Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              {/* Suggested Questions Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {suggestedQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] text-gray-600 hover:bg-gray-50 hover:border-regenesys-purple transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="bg-[#f5f5f5] rounded-2xl p-2 flex items-center gap-2 border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
                  placeholder="Ask PrivateGPT..."
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-700 px-3 py-2"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !isTyping ? 'bg-regenesys-purple text-white shadow-md' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
                Powered by Regenesys Enterprise AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RightSidebarAI;
