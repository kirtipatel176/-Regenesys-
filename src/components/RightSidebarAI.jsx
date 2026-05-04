import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, MessageSquare, BookOpen, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



const RightSidebarAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm here to help you navigate Regenesys. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "That's a great question! For more details about our programmes, you can visit the 'Programmes' section or I can give you a summary here." 
      }]);
    }, 1500);
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex items-center">
      {/* Mini Bar - Gmail Style */}
      {!isOpen && (
        <div className="bg-white border border-gray-200 border-r-0 rounded-l-2xl shadow-premium-lg p-2 flex flex-col gap-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 rounded-xl bg-regenesys-purple/10 text-regenesys-purple flex items-center justify-center hover:bg-regenesys-purple hover:text-white transition-all shadow-sm group"
            title="Regenesys AI Assistant"
          >
            <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <div className="h-px bg-gray-100 mx-1" />
          <button className="w-10 h-10 rounded-xl text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all">
            <BookOpen size={20} />
          </button>
          <button className="w-10 h-10 rounded-xl text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all">
            <MessageSquare size={20} />
          </button>
        </div>
      )}

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed right-0 top-0 bottom-0 w-[350px] bg-white shadow-2xl border-l border-gray-200 flex flex-col z-[101]"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-regenesys-purple flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-regenesys-navy leading-none mb-1">Regenesys AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Online Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fafbfc]"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-regenesys-purple flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-regenesys-purple text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-regenesys-purple flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <form 
                onSubmit={handleSend}
                className="relative flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:border-regenesys-purple/50 focus-within:bg-white transition-all overflow-hidden"
              >
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full px-4 py-3 text-[13px] bg-transparent outline-none text-gray-700"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`p-2 mr-1 rounded-lg transition-all ${
                    input.trim() && !isTyping ? 'text-regenesys-purple hover:bg-regenesys-purple/10' : 'text-gray-300'
                  }`}
                >
                  <Send size={18} />
                </button>
              </form>
              <div className="text-[10px] text-center text-gray-400 mt-3">
                Powered by Regenesys PrivateGPT
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightSidebarAI;
