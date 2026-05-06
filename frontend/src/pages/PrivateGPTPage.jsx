import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Sparkles, FileText, Trash2, 
  Upload, BookOpen, MessageSquare, LogOut, ChevronDown, X,
  Copy, ThumbsUp, ThumbsDown, ArrowLeft, ArrowRight,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getAIResponse } from '../utils/aiUtils';
import api from '../api';

const GeminiIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
  </svg>
);

const PrivateGPTPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.email === 'admin@regenesys.com';
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Storage keys specific to each user
  const STORAGE_KEY = `regenesys_chats_${user?.id || 'guest'}`;
  const SOURCES_KEY = `regenesys_sources_${user?.id || 'guest'}`;
  const NOTES_KEY = `regenesys_notes_${user?.id || 'guest'}`;

  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [conversations, setConversations] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert string dates back to Date objects
        return parsed.map(c => ({
          ...c,
          createdAt: new Date(c.createdAt),
          messages: c.messages.map(m => ({ ...m, time: new Date(m.time) }))
        }));
      } catch (e) {
        console.error("Failed to parse stored chats", e);
      }
    }
    // Default initial conversation
    return [
      { 
        id: '1', 
        title: 'New Conversation', 
        messages: [], 
        createdAt: new Date() 
      }
    ];
  });

  const [sources, setSources] = useState([]);

  // Fetch sources from backend
  const fetchSources = async () => {
    try {
      const response = await api.get('/documents');
      const mapped = response.data.map(doc => ({
        id: doc.id,
        name: doc.original_name,
        pages: doc.page_count || '?',
        type: doc.mime_type.split('/').pop().toUpperCase(),
        status: doc.processing_status
      }));
      setSources(mapped);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSources();
      // Poll for status updates if any document is pending/processing
      const interval = setInterval(() => {
        if (sources.some(s => s.status === 'pending' || s.status === 'processing')) {
          fetchSources();
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, sources.length]); // Re-run if count changes or on mount

  // Persist conversations to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations, STORAGE_KEY]);

  // Persist sources to localStorage
  useEffect(() => {
    localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
  }, [sources, SOURCES_KEY]);

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes, NOTES_KEY]);

  const [activeConvId, setActiveConvId] = useState(() => {
    return conversations?.[0]?.id || '1';
  });
  
  const [selectedNote, setSelectedNote] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showSources, setShowSources] = useState(isAdmin);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const msgsEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const messages = useMemo(() => activeConv?.messages || [], [activeConv]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingText]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || uploading) return;

    if (sources.some(s => s.name === file.name)) {
      setToast({ show: true, message: "This file is already uploaded." });
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': undefined
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        fetchSources(); // Refresh list from backend
        setToast({ show: true, message: "Document uploaded successfully!" });
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setToast({ show: true, message: "Upload failed. Please try again." });
    }
    e.target.value = '';
  };

  const handleDeleteSource = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setSources(prev => prev.filter(s => s.id !== id));
      setToast({ show: true, message: "Document deleted." });
    } catch (error) {
      console.error("Delete failed:", error);
      setToast({ show: true, message: "Failed to delete document." });
    }
  };

  const newConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
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

  const handleSend = async (e, customMsg = null) => {
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

    // Call the real API
    // Only pass session ID if it looks like a real UUID from the backend
    const isValidUUID = activeConvId?.length === 36;
    const { text: response, suggestions, sessionId, citations, sources: aiSources } = await getAIResponse(msg, isValidUUID ? activeConvId : null);
    
    setIsTyping(false);
    
    // If backend created a new session ID, we should update our local activeConvId
    let targetConvId = activeConvId;
    if (sessionId && sessionId !== activeConvId) {
      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, id: sessionId } : c));
      setActiveConvId(sessionId);
      targetConvId = sessionId;
    }

    setIsStreaming(true);
    setStreamingText('');

    // Add placeholder AI message
    const aiMsgId = Date.now().toString();
    const formattedSources = aiSources ? aiSources.map(s => s.filename) : ['programmes.pdf'];
    const aiMsg = { 
      role: 'ai', 
      text: '', 
      sources: formattedSources, 
      time: new Date(), 
      id: aiMsgId, 
      streaming: true,
      followUp: suggestions || []
    };
    
    setConversations(prev => prev.map(c => c.id === targetConvId ? { ...c, messages: [...c.messages, aiMsg] } : c));

    // Stream characters one by one
    let charIndex = 0;
    const speed = 10; // Faster streaming for better feel
    streamRef.current = setInterval(() => {
      charIndex += 2; // Stream 2 chars at a time for smoothness
      const currentText = response.slice(0, charIndex);
      setStreamingText(currentText);

      // Update the message in conversation
      setConversations(prev => prev.map(c => {
        if (c.id !== targetConvId) return c;
        return { ...c, messages: c.messages.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m) };
      }));

      if (charIndex >= (response?.length || 0)) {
        clearInterval(streamRef.current);
        setIsStreaming(false);
        setStreamingText('');
        // Mark as no longer streaming
        setConversations(prev => prev.map(c => {
          if (c.id !== targetConvId) return c;
          return { ...c, messages: c.messages.map(m => m.id === aiMsgId ? { ...m, streaming: false, text: response } : m) };
        }));
      }
    }, speed);
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ show: true, message: "Copied to clipboard!" });
  };

  const handleLike = (msgId, isLike) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== activeConvId) return c;
      return {
        ...c,
        messages: c.messages.map(m => {
          if (m.id === msgId) return { ...m, feedback: isLike ? 'like' : 'dislike' };
          return m;
        })
      };
    }));
  };

  const handleSaveNote = (text) => {
    const newNote = {
      id: Date.now(),
      text,
      date: new Date().toLocaleDateString()
    };
    setNotes(prev => [newNote, ...prev]);
    setToast({ show: true, message: "Saved to your notes!" });
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
            {/* Sidebar Header - Admin Only */}
            {isAdmin && (
              <div className="p-4 shrink-0">
                <button
                  onClick={newConversation}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all"
                >
                  <Plus size={16} /> New Chat
                </button>
              </div>
            )}

            {/* Conversations List - Admin Only */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-6">
              {isAdmin && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Conversations</div>
                  {conversations?.map(conv => (
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
              )}

              {/* Saved Notes Section */}
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">My Saved Notes ({(notes?.length || 0)})</div>
                {(!notes || notes.length === 0) ? (
                  <div className="px-2 py-4 text-[11px] text-gray-400 italic">No notes saved yet. Click "Save to note" on any AI response.</div>
                ) : (
                  <div className="space-y-2">
                    {notes?.map(note => (
                      <div 
                        key={note.id} 
                        onClick={() => setSelectedNote(note)}
                        className="p-3 bg-white border border-gray-100 rounded-xl group relative cursor-pointer hover:border-regenesys-purple/30 hover:shadow-sm transition-all"
                      >
                        <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">{note.text}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] text-gray-400">{note.date}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setNotes(prev => prev.filter(n => n.id !== note.id)); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Footer — User (Always Visible) */}
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-regenesys-purple to-indigo-700 flex items-center justify-center shadow-sm">
                <GeminiIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[15px] font-bold text-gray-800 tracking-tight">PrivateGPT</span>
              <span className="text-[10px] bg-regenesys-purple/10 text-regenesys-purple font-bold px-2 py-0.5 rounded-full">Enterprise</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
              {isAdmin && (
                <button onClick={() => setShowSources(!showSources)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all text-[12px] font-semibold text-gray-500">
                  <BookOpen size={14} /> Sources ({sources?.length || 0})
                </button>
              )}
             {!isAdmin && (
               <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all text-[12px] font-semibold text-gray-500">
                 <ArrowLeft size={14} /> Website
               </button>
             )}
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto">
              {messages.length <= 1 ? (
                /* Welcome State - Clean centered version like screenshot */
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-regenesys-purple to-indigo-700 flex items-center justify-center mb-6 shadow-lg">
                    <GeminiIcon className="w-8 h-8 text-white" />
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
                            <button 
                              onClick={() => handleSaveNote(msg.text)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-all hover:border-regenesys-purple/30"
                            >
                              <Plus size={12} /> Save to note
                            </button>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleCopy(msg.text)}
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                                title="Copy to clipboard"
                              >
                                <Copy size={14} />
                              </button>
                              <button 
                                onClick={() => handleLike(msg.id, true)}
                                className={`p-1.5 hover:bg-gray-100 rounded-md transition-colors ${msg.feedback === 'like' ? 'text-regenesys-purple bg-regenesys-purple/5' : 'text-gray-400 hover:text-gray-600'}`}
                              >
                                <ThumbsUp size={14} />
                              </button>
                              <button 
                                onClick={() => handleLike(msg.id, false)}
                                className={`p-1.5 hover:bg-gray-100 rounded-md transition-colors ${msg.feedback === 'dislike' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}
                              >
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

                        {/* Sources — only show when not streaming and for admin */}
                        {isAdmin && msg.role === 'ai' && msg.sources && !msg.streaming && (
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
                    {isAdmin && (
                      <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap mb-1.5">
                        {(sources?.length || 0)} sources
                      </span>
                    )}
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

          {/* Sources Panel - Admin Only */}
          <AnimatePresence>
            {isAdmin && showSources && (
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
                  {sources?.map((src) => (
                    <div key={src.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all group relative">
                      <div className="w-9 h-9 rounded-lg bg-regenesys-purple/10 flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-regenesys-purple" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-semibold text-gray-700 truncate">{src.name}</div>
                        <div className="text-[10px] text-gray-400">{src.pages} pages · {src.type}</div>
                      </div>
                      <button 
                        onClick={() => handleDeleteSource(src.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                        title="Remove source"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload - Admin Only */}
                <div className="p-3 border-t border-gray-100 shrink-0">
                  {uploading ? (
                    <div className="px-4 py-2.5">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-regenesys-purple font-bold">Uploading...</span>
                        <span className="text-gray-400">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-regenesys-purple"
                        />
                      </div>
                    </div>
                  ) : isAdmin ? (
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-regenesys-purple/5 hover:border-regenesys-purple/30 transition-all group">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx,.txt,.md" 
                        onChange={handleFileUpload}
                      />
                      <Upload size={14} className="text-gray-400 group-hover:text-regenesys-purple" />
                      <span className="text-[12px] text-gray-500 font-medium group-hover:text-gray-700">Upload document</span>
                    </label>
                  ) : (
                    <div 
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-xl cursor-not-allowed opacity-60"
                      title="Only administrators can upload documents"
                    >
                      <Upload size={14} className="text-gray-400" />
                      <span className="text-[12px] text-gray-400 font-medium">Upload restricted</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
      </AnimatePresence>

      {/* Note View Modal */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNote(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-premium-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-regenesys-purple/10 flex items-center justify-center">
                    <Plus size={16} className="text-regenesys-purple" />
                  </div>
                  <span className="text-[14px] font-bold text-gray-800">Saved Note</span>
                </div>
                <button onClick={() => setSelectedNote(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNote.text}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="text-[11px] text-gray-400">Saved on {selectedNote.date}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopy(selectedNote.text)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <Copy size={14} /> Copy Text
                  </button>
                  <button 
                    onClick={() => { setNotes(prev => prev.filter(n => n.id !== selectedNote.id)); setSelectedNote(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-[12px] font-bold text-red-600 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[3000] px-6 py-3 bg-gray-900/90 backdrop-blur-md text-white text-[13px] font-bold rounded-2xl shadow-premium-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-5 h-5 rounded-full bg-regenesys-gold flex items-center justify-center">
              <Sparkles size={12} className="text-regenesys-navy" />
            </div>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PrivateGPTPage;
