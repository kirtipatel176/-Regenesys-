import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAIResponse } from '../utils/aiUtils';
import { getFrontendAIResponse, fileToBase64, fileToText } from '../utils/frontendAI';

const suggestedQueries = [
  "What programmes?",
  "How to enrol?",
  "ESG Details",
  "Fee structure"
];

const renderSimpleMarkdown = (t) => {
  if (!t) return null;
  return t.split('\n').map((line, i) => {
    let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith('• ')) {
      return <div key={i} className="pl-4 relative mb-1"><span className="absolute left-0 text-regenesys-purple">•</span><span dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} /></div>;
    }
    return <div key={i} className={line === '' ? 'h-2' : 'mb-1'}><span dangerouslySetInnerHTML={{ __html: rendered }} /></div>;
  });
};

const Typewriter = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < (text?.length || 0)) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 10);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <div>{renderSimpleMarkdown(displayText)}</div>;
};

const RightSidebarAI = () => {
  const { aiSidebarOpen, setAiSidebarOpen, localDocContents } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm Regenesys PrivateGPT. I can answer questions about our programmes, admissions, fees, course content, and career outcomes. How can I help you today?", isAnimated: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const msg = typeof text === 'string' ? text : input;
    if (!msg.trim() || isTyping) return;

    const userMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Frontend ONLY AI Mode
      let aiResponse;
      if (localDocContents?.length > 0) {
        const frontendRes = await getFrontendAIResponse(msg, localDocContents);
        aiResponse = frontendRes.text;
      } else {
        const frontendRes = await getFrontendAIResponse(msg, []);
        aiResponse = frontendRes.text;
      }

      // Simulate thinking delay
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: aiResponse || "I'm sorry, I couldn't generate an answer locally.",
          isAnimated: false
        }]);
      }, 600);
    } catch (error) {
      console.error("SidePanel AI Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I'm having trouble with the local AI. Please check your Gemini API key.",
        isAnimated: true
      }]);
    }
  };

  const markAsAnimated = (index) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isAnimated: true } : m));
  };

  return (
    <>
      {/* Floating Action Button (FAB) - Moved to Bottom-Left as per request */}


      {/* Side Panel Overlay & Content */}
      <AnimatePresence>
        {aiSidebarOpen && (
          <>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white border-l border-gray-100 flex flex-col z-[2000] overflow-hidden"
            >
              {/* Header - Premium Gradient */}
              <div className="p-7 bg-gradient-to-br from-regenesys-purple to-indigo-800 text-white relative overflow-hidden">
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

              {/* Chat Content */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fc]"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-regenesys-purple shrink-0 mt-1">
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-premium ${
                      msg.role === 'user' 
                        ? 'bg-regenesys-purple text-white rounded-tr-none' 
                        : 'bg-white text-regenesys-text border border-gray-100 rounded-tl-none font-medium'
                    }`}>
                      {msg.role === 'ai' && !msg.isAnimated ? (
                        <Typewriter text={msg.text} onComplete={() => markAsAnimated(i)} />
                      ) : msg.role === 'ai' ? (
                        renderSimpleMarkdown(msg.text)
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-regenesys-purple shrink-0 mt-1">
                      <Sparkles size={14} />
                    </div>
                    <div className="bg-white border border-gray-100 px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1.5 items-center h-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-regenesys-purple/30 animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-regenesys-purple/30 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-regenesys-purple/30 animate-bounce [animation-delay:0.4s]" />
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
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] font-bold text-regenesys-muted hover:bg-regenesys-purple hover:text-white hover:border-regenesys-purple transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input Box */}
                <div className="bg-[#f0f4f8] rounded-[1.5rem] p-1.5 flex items-center gap-2 border border-transparent focus-within:bg-white focus-within:border-regenesys-purple/20 focus-within:shadow-premium-lg transition-all">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
                    placeholder="Ask PrivateGPT..."
                    className="flex-1 bg-transparent border-none outline-none text-[14px] text-regenesys-text px-4 py-2.5 font-medium placeholder-gray-400"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      input.trim() && !isTyping ? 'bg-regenesys-purple text-white shadow-premium hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
                <div className="text-[10px] text-center text-regenesys-muted mt-4 font-black uppercase tracking-[0.2em] opacity-50">
                  Powered by Regenesys Enterprise
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default RightSidebarAI;
