import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';
import { motion } from 'framer-motion';
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
      <TopBar onEnrollClick={toggleModal} />
      <Navbar onEnrollClick={toggleModal} />

      <main>
        {/* ESG Hero */}
        <section className="pt-32 pb-20 px-10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <h2 className="text-[40px] font-bold text-gray-900 mb-6">Commitment towards</h2>
                <div className="space-y-4">
                  <div className="inline-block bg-[#f0fdf4] px-6 py-3 rounded-lg border border-[#dcfce7]">
                    <h1 className="text-[48px] font-black text-[#008444] leading-tight">
                      Sustainability, Social Responsibility,
                    </h1>
                  </div>
                  <div className="block">
                    <span className="text-[48px] font-black text-gray-900 mr-4">and</span>
                    <div className="inline-block bg-[#f0fdf4] px-6 py-3 rounded-lg border border-[#dcfce7]">
                      <h1 className="text-[48px] font-black text-[#008444] leading-tight">
                        Ethical Governance
                      </h1>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <button 
                onClick={toggleModal}
                className="mt-12 bg-regenesys-navy text-white px-10 py-4 rounded-full font-bold text-[14px] hover:bg-black transition-all shadow-xl"
              >
                ENROL NOW
              </button>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
                  alt="ESG" 
                  className="rounded-[40px] shadow-2xl"
                />
                <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-[280px]">
                  <div className="text-[#008444] font-bold text-xl mb-2">100% Focused</div>
                  <p className="text-gray-500 text-[13px]">On creating sustainable value for all corporate stakeholders.</p>
                </div>
              </motion.div>
              <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#008444]/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* ESG Overview */}
        <section className="py-24 px-10 bg-gray-50">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <div className="rounded-[40px] overflow-hidden shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" alt="Governance" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-[40px] font-bold text-regenesys-navy">ESG Programme Overview</h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                At Regenesys Corporate Education, we understand that navigating the complexities of Environmental, Social, and Governance (ESG) requirements is crucial for modern businesses aiming to foster sustainability, ethical practices, and long-term growth. Our comprehensive ESG programs are designed to empower corporates to integrate robust ESG strategies seamlessly into their operations, ensuring they not only comply with regulatory demands but also drive meaningful change and enhance stakeholder value.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <div className="text-[32px] font-bold text-[#008444]">94%</div>
                  <div className="text-gray-400 font-bold text-[12px] uppercase tracking-widest">Sustainability Rate</div>
                </div>
                <div>
                  <div className="text-[32px] font-bold text-[#008444]">12+</div>
                  <div className="text-gray-400 font-bold text-[12px] uppercase tracking-widest">Governance Frameworks</div>
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
