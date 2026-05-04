import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, MessageSquare, BookOpen, 
  Plus, MoreVertical, ArrowRight, SquarePen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestedQueries = [
  "What programs are available?",
  "How do I enrol?",
  "Tell me about fees"
];

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
        text: "Regenesys offers a variety of corporate training programmes including Gen AI, ESG, and Leadership Mastery. For a full list, you can visit our Programmes page or ask me about a specific topic!" 
      }]);
    }, 1500);
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 z-[100] flex items-stretch">
      {/* Mini Bar - Gmail Style */}
      <div className="w-[56px] bg-white border-l border-gray-200 flex flex-col items-center py-4 gap-6 shrink-0 z-[102]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-indigo-50 text-regenesys-purple shadow-inner' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Regenesys AI"
        >
          <Sparkles size={20} className={isOpen ? 'scale-110' : ''} />
        </button>
        <div className="w-8 h-px bg-gray-100" />
        <button className="w-10 h-10 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all">
          <BookOpen size={20} />
        </button>
        <button className="w-10 h-10 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all">
          <MessageSquare size={20} />
        </button>
      </div>

      {/* Expanded Panel - Matches Gemini Screenshot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white border-l border-gray-200 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-white border-b border-gray-50">
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                  <Sparkles size={18} />
                </button>
                <h3 className="text-[16px] font-medium text-gray-700">Regenesys AI</h3>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <SquarePen size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[90%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-50 text-gray-700 rounded-tr-none' 
                      : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-gray-50 px-4 py-2 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Questions Area */}
              {!isTyping && messages.length < 5 && (
                <div className="pt-4 flex flex-col gap-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suggested</p>
                  {suggestedQueries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="w-fit text-left px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[13px] text-gray-600 hover:bg-indigo-50 hover:border-regenesys-purple/30 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input - Matches the Screenshot style */}
            <div className="p-4 bg-white">
              <div className="bg-[#f0f4f9] rounded-3xl p-3 border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all">
                <textarea 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder="Ask Regenesys AI"
                  className="w-full bg-transparent border-none outline-none text-[14px] text-gray-700 resize-none px-2 mb-2"
                  style={{ minHeight: '40px' }}
                />
                <div className="flex items-center justify-between px-1">
                   <div className="flex items-center gap-2">
                     <button className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors">
                       <Plus size={18} />
                     </button>
                     <button className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors">
                       <MoreVertical size={18} />
                     </button>
                   </div>
                   <button 
                     onClick={() => handleSend()}
                     disabled={!input.trim() || isTyping}
                     className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                       input.trim() && !isTyping ? 'bg-regenesys-purple text-white shadow-md hover:scale-105' : 'bg-gray-200 text-gray-400'
                     }`}
                   >
                     <ArrowRight size={20} />
                   </button>
                </div>
              </div>
              <div className="text-[10px] text-center text-gray-400 mt-4">
                Gemini in Workspace can make mistakes. <span className="underline cursor-pointer">Learn more</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightSidebarAI;
