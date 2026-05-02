import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const aiResponses = {
  "what programmes are available": "We offer 7 flagship programmes:\n\n• Role Based Programmes — tailored per job function\n• Data Zen Master — advanced analytics & data governance\n• Technology Stack — full-stack development & architecture\n• Gen AI Academy — generative AI for business\n• Fresher's Talent Transformation — campus to corporate\n• Leadership Mastery Suite — from manager to CXO\n• ESG Programme — sustainability & governance\n\nEach can be customised to your organisation's needs.",
  "how do i enrol": "Enrolment is simple:\n\n1. Click 'Get Started' or 'Enrol Now' above\n2. Fill in your details and training interest\n3. A Regenesys expert will contact you within 24 hours\n4. We'll customise a programme for your team\n\nYou can also call us directly at +91 9773456788 or email Regenesys.consulting@regenesys.net.",
  "gen ai academy": "The Gen AI Academy focuses on:\n\n• Integration of generative AI tools for business optimisation\n• AI-driven solutions for data analysis & decision-making\n• Practical implementation of AI strategies across functions\n• Hands-on labs with the latest LLM tools\n\nIdeal for IT managers, data teams, and business leaders wanting to harness AI for competitive advantage.",
  "fee structure": "Our pricing is bespoke — we tailor programmes to your organisation's size, industry, and learning objectives. Factors include:\n\n• Number of participants\n• Programme duration & format (online/offline/blended)\n• Level of customisation required\n• Industry-specific content additions\n\nContact us at +91 9773456788 for a personalised quote."
};

const PrivateGPT = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: "👋 Hi! I'm Regenesys PrivateGPT. I can answer questions about our programmes, admissions, fees, course content, and career outcomes. How can I help you today?",
      sources: ['programmes.pdf', 'esg_manual.pdf']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const msgsEndRef = useRef(null);

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = msg.toLowerCase();
      const key = Object.keys(aiResponses).find(k => k.split(' ').some(w => lower.includes(w)));
      const resp = key ? aiResponses[key] : "Great question! Based on our knowledge base, Regenesys Corporate Education offers world-class bespoke training across India. For specific enquiries, our experts are available at +91 9773456788.";
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: resp,
        sources: ['programmes.pdf', 'faq.md']
      }]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Help Button - Updated with Green/Navy Theme */}
      <div className="fixed bottom-7 right-7 z-[9000] flex items-center group">
        <div className="mr-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none bg-regenesys-navy text-white text-[12px] font-semibold py-1.5 px-3 rounded-full shadow-lg">
          Ask PrivateGPT
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#008444] to-[#00a651] shadow-[0_6px_24px_rgba(0,132,68,0.45)] flex items-center justify-center text-white hover:scale-110 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,transparent_70%)] opacity-20 group-hover:opacity-40 transition-opacity" />
          <Sparkles size={26} className="relative z-10" />
        </button>
      </div>

      {/* Drawer - Updated with Green/Navy High-Fidelity Theme */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-7 z-[8999] w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: '600px' }}
          >
            {/* Header */}
            <div className="bg-regenesys-navy p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008444] to-[#ffcc00] flex items-center justify-center text-white font-head font-bold shadow-inner">P</div>
              <div className="flex-1">
                <div className="text-white text-[15px] font-bold leading-tight">Regenesys PrivateGPT</div>
                <div className="text-[11px] text-white/50 font-medium">Enterprise Intelligence Active</div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"><X size={20} /></button>
            </div>

            {/* Status Bar */}
            <div className="bg-gray-50 border-b border-gray-100 px-5 py-2 flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5 text-[#008444]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#008444] animate-pulse" /> AI READY
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <Check size={10} strokeWidth={3} /> KNOWLEDGE SYNCED
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white relative">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                   style={{ backgroundImage: 'radial-gradient(#1A237E 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
              
              <div className="relative z-10 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm ${msg.role === 'ai' ? 'bg-[#f0f9f4] text-[#008444]' : 'bg-regenesys-navy text-white'}`}>
                      {msg.role === 'ai' ? 'P' : 'U'}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-[13.5px] leading-relaxed ${msg.role === 'user' ? 'bg-regenesys-navy text-white shadow-md' : 'bg-gray-50 border border-gray-100 text-gray-800'}`}>
                      {msg.text.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>{line}<br/></React.Fragment>
                      ))}
                      {msg.sources && (
                        <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-200/50">
                          {msg.sources.map((s, idx) => (
                            <span key={idx} className="bg-white border border-gray-200 px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-500 hover:border-[#008444] hover:text-[#008444] cursor-pointer transition-all">📄 {s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f9f4] text-[#008444] flex items-center justify-center text-[12px] font-bold">P</div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#008444]/30 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={msgsEndRef} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-5 pb-4 flex gap-2 flex-wrap bg-white">
              {["What programmes?", "How to enrol?", "ESG Details"].map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(q)}
                  className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-[11px] font-bold text-gray-500 hover:border-[#008444] hover:text-[#008444] hover:bg-[#f0f9f4] transition-all whitespace-nowrap shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Container */}
            <div className="p-5 border-t border-gray-100 bg-white">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2 p-1.5 focus-within:border-[#008444] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#008444]/5 transition-all">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about ESG, Leadership..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 text-[14px] px-3 h-11 placeholder-gray-400"
                />
                <button 
                  onClick={() => handleSend()}
                  className="w-11 h-11 rounded-xl bg-[#008444] text-white flex items-center justify-center hover:bg-regenesys-navy transition-all shadow-lg shadow-[#008444]/10"
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PrivateGPT;
