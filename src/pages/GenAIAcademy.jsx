import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, BrainCircuit, Sparkles, Zap, Bot, MessageCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';

const GenAIAcademy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopBar onEnrollClick={toggleModal} />
      <Navbar onEnrollClick={toggleModal} />
      
      <main className="pt-20 lg:pt-0">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center overflow-hidden bg-[#000]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/20" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          
          <div className="relative z-10 px-6 lg:px-24 max-w-7xl mx-auto w-full text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-xl">
                <Sparkles className="text-purple-400" size={16} />
                <span className="text-white font-bold text-[11px] uppercase tracking-[0.3em]">The Future of Work</span>
              </div>
              <h1 className="font-head text-[42px] lg:text-[84px] text-white font-bold leading-none mb-8">
                Gen AI <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Academy.</span>
              </h1>
              <p className="text-white/60 text-lg lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                Master the integration of generative AI to optimise business processes and enhance data-driven decision making.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={toggleModal} className="bg-white text-black px-12 py-5 rounded-full font-black text-[15px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
                  JOIN THE ACADEMY
                </button>
                <button className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full font-black text-[15px] hover:bg-white/10 transition-all">
                  VIEW MODULES
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Impact Cards */}
        <section className="py-24 lg:py-32 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-12 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-premium-2xl transition-all duration-700 hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-purple-600 transition-all">
                  <Zap className="text-purple-600 group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-5">Process Optimisation</h3>
                <p className="text-regenesys-muted text-[15px] leading-relaxed">Integrate generative AI tools to streamline business workflows and drive unprecedented efficiency.</p>
              </div>
              <div className="p-12 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-premium-2xl transition-all duration-700 hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-all">
                  <BrainCircuit className="text-blue-600 group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-5">AI-Driven Insights</h3>
                <p className="text-regenesys-muted text-[15px] leading-relaxed">Enhance data analysis and strategic decision-making with advanced AI-driven solutions.</p>
              </div>
              <div className="p-12 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-premium-2xl transition-all duration-700 hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-emerald-600 transition-all">
                  <Bot className="text-emerald-600 group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-5">Practical Strategy</h3>
                <p className="text-regenesys-muted text-[15px] leading-relaxed">Gain practical knowledge for implementing AI strategies effectively across all business functions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Tech Section */}
        <section className="py-24 lg:py-40 px-6 lg:px-24 bg-regenesys-navy text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-head text-[36px] lg:text-[56px] font-bold mb-6 italic text-blue-400">Gen AI Academy Curriculum</h2>
              <p className="text-white/40 text-lg uppercase tracking-[0.3em] font-bold">Leading the Generative Revolution</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div>
                  <div className="text-blue-500 font-black text-4xl mb-4">01.</div>
                  <h4 className="text-2xl font-bold mb-4">Prompt Engineering Mastery</h4>
                  <p className="text-white/60 leading-relaxed">Advanced techniques for communicating with LLMs to get precise business results.</p>
                </div>
                <div>
                  <div className="text-purple-500 font-black text-4xl mb-4">02.</div>
                  <h4 className="text-2xl font-bold mb-4">Custom AI Agent Development</h4>
                  <p className="text-white/60 leading-relaxed">Building autonomous agents to handle repetitive business tasks and data processing.</p>
                </div>
                <div>
                  <div className="text-emerald-500 font-black text-4xl mb-4">03.</div>
                  <h4 className="text-2xl font-bold mb-4">Ethical AI & Compliance</h4>
                  <p className="text-white/60 leading-relaxed">Ensuring your AI initiatives are secure, unbiased, and legally compliant.</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-[60px] p-16 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-3xl -z-10 group-hover:bg-blue-600/40 transition-all" />
                <h3 className="text-3xl font-bold mb-10 leading-tight">Implement AI Strategies That Actually Work.</h3>
                <div className="space-y-6">
                  {["Workflow Automation", "Synthetic Data Generation", "AI in Marketing & Sales", "RAG Systems Implementation"].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xl font-medium text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
                <button onClick={toggleModal} className="mt-16 w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl font-black text-xl hover:shadow-2xl transition-all">
                  GET ACADEMY ACCESS
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      <PrivateGPT />
    </div>
  );
};

export default GenAIAcademy;
