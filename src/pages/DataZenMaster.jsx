import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, BarChart, Shield, Cpu } from 'lucide-react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';

const DataZenMaster = () => {
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
        <section className="relative min-h-[500px] flex items-center overflow-hidden bg-[#0a192f]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10 px-6 lg:px-24 max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-block px-4 py-1.5 bg-blue-600/20 rounded-full border border-blue-500/30 mb-6">
                <span className="text-blue-400 font-bold text-[11px] uppercase tracking-widest">Advanced Analytics</span>
              </div>
              <h1 className="font-head text-[42px] lg:text-[72px] text-white font-bold leading-[1.1] mb-8">
                Master the Art of <br/>
                <span className="text-blue-500 italic">Data Intelligence.</span>
              </h1>
              <p className="text-white/70 text-lg lg:text-xl max-w-xl mb-12 leading-relaxed">
                Transform complex data into actionable strategic insights with our flagship Data Zen Master programme.
              </p>
              <button onClick={toggleModal} className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl">
                DOWNLOAD CURRICULUM
              </button>
            </motion.div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-24 lg:py-32 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-10 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-premium-xl transition-all border border-transparent hover:border-blue-100 group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
                  <BarChart className="text-blue-600 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-regenesys-navy mb-4">Advanced Visualisation</h3>
                <p className="text-regenesys-muted text-[14px] leading-relaxed">Master techniques to drive business insights through powerful data storytelling.</p>
              </div>
              <div className="p-10 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-premium-xl transition-all border border-transparent hover:border-blue-100 group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
                  <Shield className="text-blue-600 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-regenesys-navy mb-4">Governance & Security</h3>
                <p className="text-regenesys-muted text-[14px] leading-relaxed">Expertise in data privacy, ethical considerations, and robust security frameworks.</p>
              </div>
              <div className="p-10 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-premium-xl transition-all border border-transparent hover:border-blue-100 group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
                  <Cpu className="text-blue-600 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-regenesys-navy mb-4">Big Data Technologies</h3>
                <p className="text-regenesys-muted text-[14px] leading-relaxed">Leverage cutting-edge big data tools for strategic, data-driven decision making.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Curriculum Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-head text-[36px] lg:text-[48px] text-regenesys-navy font-bold leading-tight mb-8">Comprehensive <br/>Data Ecosystem</h2>
              <div className="space-y-6">
                {[
                  "Predictive Analytics & Modelling",
                  "Data Warehousing & ETL Processes",
                  "Business Intelligence Tools (Tableau/PowerBI)",
                  "Python & R for Data Science",
                  "Machine Learning Foundations"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <Check className="text-white" size={14} strokeWidth={3} />
                    </div>
                    <span className="text-lg text-regenesys-navy font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[40px] blur-2xl" />
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl bg-[#0a192f] p-12 border border-white/10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center p-6 bg-white/5 rounded-2xl">
                    <div className="text-3xl font-bold text-white mb-1">200+</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Hours of Content</div>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-2xl">
                    <div className="text-3xl font-bold text-white mb-1">15+</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Real Projects</div>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-blue-600 rounded-2xl text-center">
                  <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">Next Batch</div>
                  <div className="text-xl font-bold text-white">Starts 15th June 2024</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      
    </div>
  );
};

export default DataZenMaster;
