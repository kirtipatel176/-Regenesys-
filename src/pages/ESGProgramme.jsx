import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import esgHero from '../assets/role_woman.png'; // Placeholder for ESG context
import esgDetail from '../assets/role_manager.png'; // Placeholder for detail

const ESGProgramme = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="ESG Programme | Corporate Sustainability" 
        description="Master Environmental, Social, and Governance (ESG) frameworks with Regenesys. Empower your organization with sustainable strategic value."
      />
      <TopBar onEnrollClick={toggleModal} />
      <Navbar onEnrollClick={toggleModal} />

      <main className="pt-20 lg:pt-0">
        {/* ESG Hero - Premium Refinement */}
        <section className="relative pt-24 lg:pt-48 pb-20 lg:pb-32 px-6 lg:px-10 overflow-hidden bg-white">
          {/* Subtle background patterns */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#f0fdf4] to-transparent rounded-full blur-3xl -z-10 opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-[#f0fdf4] to-transparent rounded-full blur-3xl -z-10 opacity-40" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left order-2 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-regenesys-navy/5 text-regenesys-navy text-[11px] font-bold uppercase tracking-[0.2em] mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-regenesys-red animate-pulse" />
                  Corporate Sustainability
                </div>
                
                <h1 className="font-head text-[36px] lg:text-[64px] font-bold text-regenesys-navy leading-[1.1] mb-8">
                  Commitment <span className="text-[#008444]">towards</span> a Sustainable Future.
                </h1>
                
                <p className="text-[16px] lg:text-[18px] text-regenesys-muted leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                  We empower organisations to navigate the complexities of Environmental, Social, and Governance (ESG) requirements through ethical frameworks and sustainable strategic value.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={toggleModal}
                    className="bg-regenesys-navy text-white px-10 py-4.5 rounded-full font-bold text-[14px] hover:bg-[#008444] transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                    ENROL NOW
                  </button>
                  <button className="px-10 py-4.5 rounded-full font-bold text-[14px] border border-gray-200 text-regenesys-navy hover:bg-gray-50 transition-all">
                    Download Brochure
                  </button>
                </div>
              </motion.div>

              <div className="relative order-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative z-10"
                >
                  <div className="rounded-[40px] overflow-hidden shadow-premium-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
                      alt="Sustainability" 
                      className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto"
                    />
                  </div>
                  
                  {/* Floating Info Card */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute -bottom-10 -left-6 lg:-left-12 bg-white/95 backdrop-blur-md p-6 lg:p-8 rounded-3xl shadow-premium-xl border border-white/20 max-w-[300px]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-[#008444]">
                        <div className="w-5 h-5 rounded-sm border-2 border-current" />
                      </div>
                      <div className="text-[#008444] font-bold text-lg">100% Focused</div>
                    </div>
                    <p className="text-gray-600 text-[13px] leading-relaxed font-medium">
                      On creating sustainable value for all corporate stakeholders through governance.
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ESG Overview - Minimalist Design */}
        <section className="py-24 lg:py-40 px-6 lg:px-10 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2 w-full">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#008444] rounded-[40px] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-500" />
                  <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-[16/10] lg:aspect-square">
                    <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" alt="Governance" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 space-y-10 text-center lg:text-left">
                <div>
                  <h2 className="text-[12px] font-bold text-[#008444] uppercase tracking-[0.3em] mb-4">Programme Details</h2>
                  <h3 className="text-[32px] lg:text-[44px] font-bold text-regenesys-navy leading-tight">ESG Programme Overview</h3>
                </div>
                
                <p className="text-gray-600 text-[16px] lg:text-lg leading-relaxed font-medium">
                  At Regenesys Corporate Education, we navigate the complexities of Environmental, Social, and Governance (ESG) requirements. Our programs empower corporates to integrate robust ESG strategies seamlessly into their operations, ensuring regulatory compliance and enhanced stakeholder value.
                </p>
                
                <div className="grid grid-cols-2 gap-10 pt-6">
                  <div className="space-y-2">
                    <div className="text-[40px] lg:text-[52px] font-black text-[#008444] leading-none">94%</div>
                    <div className="text-regenesys-navy font-bold text-[11px] uppercase tracking-widest opacity-40">Sustainability Rate</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[40px] lg:text-[52px] font-black text-[#008444] leading-none">12+</div>
                    <div className="text-regenesys-navy font-bold text-[11px] uppercase tracking-widest opacity-40">Governance Frameworks</div>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="inline-flex items-center gap-3 text-regenesys-navy font-bold text-[15px] group">
                    View Course Curriculum 
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#008444] group-hover:text-white transition-all">→</span>
                  </button>
                </div>
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

export default ESGProgramme;
