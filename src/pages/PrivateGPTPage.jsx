import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Sparkles, FileText, Trash2, 
  Upload, BookOpen, MessageSquare, LogOut, ChevronDown,
  Copy, ThumbsUp, ThumbsDown, ArrowLeft, ArrowRight,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Knowledge base responses
const knowledgeBase = {
  programmes: "We offer 7 flagship programmes:\n\n• **Role Based Programmes** — Tailored per job function\n• **Data Zen Master** — Advanced analytics & data governance\n• **Technology Stack** — Full-stack development & architecture\n• **Gen AI Academy** — Generative AI for business\n• **Fresher's Talent Transformation** — Campus to corporate\n• **Leadership Mastery Suite** — From manager to CXO\n• **ESG Programme** — Sustainability & governance\n\nEach can be customised to your organisation's specific needs and scale.",
  enrol: "**Enrolment Process:**\n\n1. Click 'Get Started' or 'Enrol Now' on our website\n2. Fill in your details and training interest\n3. A Regenesys expert will contact you within 24 hours\n4. We'll customise a programme for your team\n\nYou can also reach us directly:\n📧 Regenesys.consulting@regenesys.net\n📞 +91 9773456788",
  ai: "**The Gen AI Academy** focuses on:\n\n• Integration of generative AI tools for business optimisation\n• AI-driven solutions for data analysis & decision-making\n• Practical implementation of AI strategies across functions\n• Hands-on labs with the latest LLM tools\n\nIdeal for IT managers, data teams, and business leaders wanting to harness AI for competitive advantage.",
  fee: "Our pricing is **bespoke** — we tailor programmes to your organisation's size, industry, and learning objectives.\n\n**Factors that influence pricing:**\n• Number of participants\n• Programme duration & format (online/offline/blended)\n• Level of customisation required\n• Industry-specific content additions\n\nContact us at **+91 9773456788** for a personalised quote.",
  esg: "**The ESG Programme** covers:\n\n• Master the essentials of sustainability reporting\n• Drive impactful change with practical ESG strategies\n• Lead with a global perspective on environmental and social governance\n• Understand regulatory frameworks and compliance requirements\n\nDesigned for board members, C-suite executives, and sustainability officers.",
  leadership: "**Leadership Mastery Suite** includes:\n\n• Strategic thinking & decision-making for senior leaders\n• Advanced communication and team management\n• Innovation & adaptability in dynamic business environments\n• Women in Leadership specialised track\n• Executive coaching and mentorship\n\nOver 40+ women leaders trained through our Tata Steel partnership alone.",
  data: "**Data Zen Master** programme covers:\n\n• Advanced data analytics & visualisation techniques\n• Data governance, security & ethical considerations\n• Big data technologies for strategic decision-making\n• Python, R, SQL, and Tableau hands-on workshops\n• Real-world case studies from BFSI and manufacturing sectors",
  about: "**Regenesys Corporate Education** is part of Regenesys, a Global Educational Institution with 25+ years of legacy.\n\n**Key Facts:**\n• 2000+ participants trained across industries\n• 100+ batches conducted\n• 5000+ hours of transformative learning\n• Clients include Tata Steel, CRISIL, HDFC Bank, Bajaj Finserv, Hindalco\n\nWe specialise in IT/ITES, BPO, GCC, and manufacturing sectors.",
  technology: "**Technology Stack** programme includes:\n\n• Full Stack Development (Java, Django, Mobile App)\n• Cloud computing & DevOps\n• System architecture & integration\n• Cybersecurity fundamentals\n• Agile & Scrum methodologies\n\n54 participants trained across 3 batches with 510+ total training hours.",
  fresher: "**Fresher's Talent Transformation Programme:**\n\n• Bridge the gap from campus to corporate\n• Essential technical & soft skills training\n• Hands-on projects & real-world simulations\n• Mentorship from industry experts\n• Corporate communication & professional etiquette\n\nDesigned to make fresh graduates workplace-ready from day one."
};

const getAIResponse = (query) => {
  const lower = query.toLowerCase();
  let text;
  let suggestions;

  if (lower.includes('programme') || lower.includes('program') || lower.includes('course') || lower.includes('offer')) {
    text = knowledgeBase.programmes;
    suggestions = ["How do I enrol?", "What is the fee structure?", "Tell me about leadership programmes"];
  } else if (lower.includes('enrol') || lower.includes('enroll') || lower.includes('register') || lower.includes('join') || lower.includes('start')) {
    text = knowledgeBase.enrol;
    suggestions = ["What are the fees?", "Available programmes", "Contact details"];
  } else if (lower.includes('gen ai') || lower.includes('artificial intelligence') || lower.includes('genai') || lower.includes('llm')) {
    text = knowledgeBase.ai;
    suggestions = ["Who is this for?", "Programme duration?", "Prerequisites for Gen AI"];
  } else if (lower.includes('fee') || lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) {
    text = knowledgeBase.fee;
    suggestions = ["Discount for groups?", "Enrolment process", "Payment methods"];
  } else if (lower.includes('esg') || lower.includes('sustainability') || lower.includes('environment')) {
    text = knowledgeBase.esg;
    suggestions = ["Is there a certification?", "Case studies", "Who should attend?"];
  } else if (lower.includes('leader') || lower.includes('management') || lower.includes('executive')) {
    text = knowledgeBase.leadership;
    suggestions = ["Women in leadership", "Strategic thinking modules", "Executive coaching"];
  } else if (lower.includes('data') || lower.includes('analytics') || lower.includes('zen')) {
    text = knowledgeBase.data;
    suggestions = ["Tools covered?", "Is Python required?", "Data security modules"];
  } else if (lower.includes('about') || lower.includes('regenesys') || lower.includes('company') || lower.includes('who')) {
    text = knowledgeBase.about;
    suggestions = ["Our clients", "Flagship programmes", "Company history"];
  } else if (lower.includes('tech') || lower.includes('stack') || lower.includes('development') || lower.includes('coding')) {
    text = knowledgeBase.technology;
    suggestions = ["Full stack details", "Cybersecurity modules", "Cloud computing"];
  } else if (lower.includes('fresher') || lower.includes('campus') || lower.includes('graduate') || lower.includes('talent')) {
    text = knowledgeBase.fresher;
    suggestions = ["Soft skills modules", "Mentorship details", "How to apply"];
  } else {
    text = "I've searched our internal knowledge base regarding your query. Regenesys Corporate Education offers world-class bespoke training programmes across India.\n\nFor specific enquiries, contact us at **+91 9773456788** or email **Regenesys.consulting@regenesys.net**.";
    suggestions = ["Available programmes", "Gen AI Academy", "Fee structure"];
  }

  return { text, suggestions };
};

const PrivateGPTPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: '1', title: 'Welcome Chat', messages: [{ role: 'ai', text: `Hello ${user?.name || 'there'}! Welcome to Regenesys PrivateGPT — your enterprise knowledge assistant.\n\nI have access to our internal knowledge base including programme details, enrolment processes, success stories, and more.\n\n**What would you like to know?**`, sources: ['programmes.pdf', 'company_overview.pdf'], time: new Date() }], createdAt: new Date() }
  ]);
  const [activeConvId, setActiveConvId] = useState('1');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [showSources, setShowSources] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const msgsEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const messages = useMemo(() => activeConv?.messages || [], [activeConv]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingText]);

  const sources = [
    { name: 'programmes.pdf', pages: 24, type: 'PDF' },
    { name: 'esg_manual.pdf', pages: 18, type: 'PDF' },
    { name: 'faq.md', pages: 8, type: 'Markdown' },
    { name: 'success_stories.pdf', pages: 32, type: 'PDF' },
    { name: 'company_overview.pdf', pages: 12, type: 'PDF' },
  ];

  const newConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{ role: 'ai', text: 'How can I help you today? Ask me anything about Regenesys programmes, training, or corporate education.', sources: ['programmes.pdf'], time: new Date() }],
      createdAt: new Date()
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const deleteConversation = (id) => {
    if (conversations.length <= 1) return;
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (activeConvId === id) setActiveConvId(updated[0].id);
  };

  const handleSend = (e, customMsg = null) => {
    const msg = customMsg || input.trim();
    if (!msg || isTyping || isStreaming) return;

    const userMsg = { role: 'user', text: msg, time: new Date() };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        const updated = { ...c, messages: [...c.messages, userMsg] };
        if (c.title === 'New Conversation') updated.title = msg.slice(0, 40) + (msg.length > 40 ? '...' : '');
        return updated;
      }
      return c;
    }));

    setInput('');
    setIsTyping(true);

    // Simulate thinking delay, then stream
    setTimeout(() => {
      const { text: response, suggestions } = getAIResponse(msg);
      setIsTyping(false);
      setIsStreaming(true);
      setStreamingText('');

      // Add placeholder AI message
      const aiMsgId = Date.now().toString();
      const aiMsg = { 
        role: 'ai', 
        text: '', 
        sources: ['programmes.pdf', 'faq.md'], 
        time: new Date(), 
        id: aiMsgId, 
        streaming: true,
        followUp: suggestions
      };
      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, aiMsg] } : c));

      // Stream characters one by one
      let charIndex = 0;
      const speed = 10; // Faster streaming for better feel
      streamRef.current = setInterval(() => {
        charIndex += 2; // Stream 2 chars at a time for smoothness
        const currentText = response.slice(0, charIndex);
        setStreamingText(currentText);

        // Update the message in conversation
        setConversations(prev => prev.map(c => {
          if (c.id !== activeConvId) return c;
          return { ...c, messages: c.messages.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m) };
        }));

        if (charIndex >= response.length) {
          clearInterval(streamRef.current);
          setIsStreaming(false);
          setStreamingText('');
          // Mark as no longer streaming
          setConversations(prev => prev.map(c => {
            if (c.id !== activeConvId) return c;
            return { ...c, messages: c.messages.map(m => m.id === aiMsgId ? { ...m, streaming: false } : m) };
          }));
        }
      }, speed);
    }, 1000);
  };

  const handleSuggestedClick = (q) => {
    setInput(q);
    setTimeout(() => {
      handleSend(null, q);
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('• ')) {
        return <div key={i} className="pl-4 relative mb-1"><span className="absolute left-0 text-regenesys-purple">•</span><span dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} /></div>;
      }
      if (rendered.match(/^\d+\./)) {
        return <div key={i} className="pl-4 mb-1"><span dangerouslySetInnerHTML={{ __html: rendered }} /></div>;
      }
      return <div key={i} className={line === '' ? 'h-2' : 'mb-1'}><span dangerouslySetInnerHTML={{ __html: rendered }} /></div>;
    });
  };

  const suggestedQueries = [
    "What programmes are available?",
    "Tell me about the Gen AI Academy",
    "How does enrolment work?",
    "What is the fee structure?"
  ];

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-[#f7f8fa] border-r border-gray-200 flex flex-col shrink-0 overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className="p-4 shrink-0">
              <button
                onClick={newConversation}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                <Plus size={16} /> New Chat
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Conversations</div>
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer mb-0.5 transition-all ${activeConvId === conv.id ? 'bg-white shadow-sm border border-gray-100' : 'hover:bg-white/60'}`}
                >
                  <MessageSquare size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700 truncate flex-1">{conv.title}</span>
                  {conversations.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Footer — User */}
            <div className="p-3 border-t border-gray-200 shrink-0 relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-regenesys-purple text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  {user?.avatar || 'U'}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-gray-800 truncate">{user?.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
                </div>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl border border-gray-200 shadow-premium-lg overflow-hidden z-50"
                  >
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 transition-all">
                      <ArrowLeft size={14} /> Back to Website
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-600 hover:bg-red-50 transition-all border-t border-gray-100">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-regenesys-purple to-indigo-700 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-[14px] font-bold text-gray-800">PrivateGPT</span>
              <span className="text-[10px] bg-regenesys-purple/10 text-regenesys-purple font-bold px-2 py-0.5 rounded-full">Enterprise</span>
            </div>
          </div>
          <button onClick={() => setShowSources(!showSources)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all text-[12px] font-semibold text-gray-500">
            <BookOpen size={14} /> Sources ({sources.length})
          </button>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto">
              {messages.length <= 1 ? (
                /* Welcome State */
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-regenesys-purple to-indigo-700 flex items-center justify-center mb-6 shadow-lg">
                    <Sparkles size={28} className="text-white" />
                  </div>
                  <h2 className="text-[22px] font-bold text-gray-800 mb-2">Regenesys PrivateGPT</h2>
                  <p className="text-[14px] text-gray-500 mb-8 text-center max-w-md">
                    Your enterprise AI assistant. Ask questions about programmes, training, enrolment, or any topic from our knowledge base.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {suggestedQueries.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                        className="text-left px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-[13px] text-gray-600 hover:bg-white hover:shadow-sm hover:border-regenesys-purple/30 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Messages */
                <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 space-y-6">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-regenesys-purple to-indigo-700 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles size={14} className="text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                        <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-regenesys-purple text-white rounded-br-md' 
                            : 'bg-[#f7f8fa] text-gray-700 rounded-bl-md'
                        }`}>
                            {msg.role === 'ai' ? (
                            <>
                              {renderMarkdown(msg.text)}
                              {msg.streaming && <span className="inline-block w-0.5 h-4 bg-regenesys-purple ml-0.5 animate-pulse align-middle" />}
                            </>
                          ) : msg.text}
                        </div>

                        {/* Actions for AI messages — only show when not streaming */}
                        {msg.role === 'ai' && !msg.streaming && (
                          <div className="flex items-center gap-3 mt-4 ml-1">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                              <Plus size={12} /> Save to note
                            </button>
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600">
                                <Copy size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600">
                                <ThumbsUp size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600">
                                <ThumbsDown size={14} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Dynamic Follow-up Suggestions */}
                        {msg.role === 'ai' && msg.followUp && !msg.streaming && (
                          <div className="flex flex-col gap-2 mt-6 ml-1">
                            {msg.followUp.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestedClick(q)}
                                className="w-fit text-left px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] text-gray-600 hover:bg-regenesys-purple hover:text-white hover:border-regenesys-purple transition-all duration-300"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Sources — only show when not streaming */}
                        {msg.role === 'ai' && msg.sources && !msg.streaming && (
                          <div className="flex gap-2 flex-wrap mt-2 ml-1">
                            {msg.sources.map((s, idx) => (
                              <span key={idx} className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-[10px] font-medium text-gray-500 flex items-center gap-1.5">
                                <FileText size={10} className="text-regenesys-purple" /> {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-1 text-[11px] font-bold text-gray-500">
                          {user?.avatar || 'U'}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-regenesys-purple to-indigo-700 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div className="bg-[#f7f8fa] px-4 py-3 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1.5 items-center h-5">
                          <div className="w-1.5 h-1.5 rounded-full bg-regenesys-purple/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-regenesys-purple/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-regenesys-purple/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={msgsEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="px-4 lg:px-8 pb-4 pt-2 shrink-0">
              <div className="max-w-3xl mx-auto">
                <div className="bg-[#f0f4f9] rounded-3xl p-1.5 flex items-end gap-2 border border-transparent transition-all focus-within:bg-white focus-within:shadow-premium-lg focus-within:border-gray-200">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start typing..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 text-[14px] px-5 py-3.5 resize-none max-h-32 placeholder-gray-400 font-medium"
                    style={{ minHeight: '52px' }}
                  />
                  <div className="flex items-center gap-4 pr-3 pb-2">
                    <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap mb-1.5">
                      {sources.length} sources
                    </span>
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isTyping || isStreaming}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        input.trim() && !isTyping && !isStreaming
                          ? 'bg-regenesys-purple text-white shadow-lg hover:scale-105'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-center text-gray-400 mt-4 font-medium">
                  NotebookLM can be inaccurate; please double check its responses.
                </div>
              </div>
            </div>
          </div>

          {/* Sources Panel */}
          <AnimatePresence>
            {showSources && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full border-l border-gray-100 bg-[#fafbfc] flex flex-col shrink-0 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 shrink-0">
                  <h3 className="text-[13px] font-bold text-gray-800 mb-1">Knowledge Sources</h3>
                  <p className="text-[11px] text-gray-400">Documents used for AI responses</p>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {sources.map((src, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all cursor-pointer group">
                      <div className="w-9 h-9 rounded-lg bg-regenesys-purple/10 flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-regenesys-purple" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-gray-700 truncate">{src.name}</div>
                        <div className="text-[10px] text-gray-400">{src.pages} pages · {src.type}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload */}
                <div className="p-3 border-t border-gray-100 shrink-0">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-regenesys-purple/5 hover:border-regenesys-purple/30 transition-all">
                    <input type="file" className="hidden" accept=".pdf,.docx,.txt,.md" />
                    <Upload size={14} className="text-gray-400" />
                    <span className="text-[12px] text-gray-500 font-medium">Upload document</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PrivateGPTPage;
