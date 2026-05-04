import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trophy, Users, TrendingUp, Lightbulb } from 'lucide-react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';

const LeadershipMastery = () => {
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
        <section className="relative min-h-[500px] flex items-center overflow-hidden bg-regenesys-navy">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10 px-6 lg:px-24 max-w-7xl mx-auto w-full text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-regenesys-gold font-bold text-[13px] uppercase tracking-[0.4em] mb-6">Executive Excellence</div>
              <h1 className="font-head text-[40px] lg:text-[76px] text-white font-bold leading-tight mb-8">
                Master the Art of <br/>
                <span className="text-regenesys-gold italic">Strategic Leadership.</span>
              </h1>
              <p className="text-white/60 text-lg lg:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Empower your career with advanced decision-making, strategic thinking, and team management abilities.
              </p>
              <div className="flex justify-center">
                <button onClick={toggleModal} className="bg-regenesys-gold text-regenesys-navy px-12 py-4 rounded-full font-black text-[15px] hover:bg-white transition-all shadow-premium-2xl active:scale-95">
                  RESERVE YOUR SEAT
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pillars of Mastery */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-white relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100 group-hover:bg-regenesys-navy group-hover:scale-110 transition-all duration-500">
                  <TrendingUp className="text-regenesys-navy group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-4">Strategic Thinking</h3>
                <p className="text-regenesys-muted text-[15px] leading-relaxed">Develop a global perspective on business challenges and long-term scaling strategies.</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100 group-hover:bg-regenesys-navy group-hover:scale-110 transition-all duration-500">
                  <Users className="text-regenesys-navy group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-4">Team Excellence</h3>
                <p className="text-regenesys-muted text-[15px] leading-relaxed">Master the nuances of emotional intelligence and high-performance team dynamics.</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100 group-hover:bg-regenesys-navy group-hover:scale-110 transition-all duration-500">
                  <Lightbulb className="text-regenesys-navy group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-4">Foster Innovation</h3>
                <p className="text-regenesys-muted text-[15px] leading-relaxed">Cultivate an organizational culture that adapts to change and leads market innovation.</p>
              </div>
           </div>
        </section>

        {/* Executive Modules */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-[#0a0a0a] text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="font-head text-[36px] lg:text-[56px] font-bold mb-10 leading-tight">Elite <br/><span className="text-regenesys-gold">Leadership</span> Modules</h2>
                <div className="space-y-6">
                  {[
                    "Global Business Transformation",
                    "High-Stakes Decision Making",
                    "Agile Leadership in Crisis",
                    "Organisational Culture Design",
                    "Advanced Executive Communication"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-regenesys-gold/40 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-regenesys-gold/10 flex items-center justify-center">
                        <Check className="text-regenesys-gold" size={20} strokeWidth={3} />
                      </div>
                      <span className="text-xl font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-regenesys-gold/5 rounded-[60px] blur-3xl" />
                <div className="relative bg-white/5 backdrop-blur-md p-16 rounded-[60px] border border-white/10 text-center">
                   <Trophy className="text-regenesys-gold mx-auto mb-10" size={64} />
                   <h3 className="text-3xl font-bold mb-6 italic leading-tight">"A leader is one who knows the way, goes the way, and shows the way."</h3>
                   <div className="text-sm font-bold uppercase tracking-[4px] text-white/40 mb-10">- John C. Maxwell</div>
                   <button onClick={toggleModal} className="w-full py-5 bg-white text-regenesys-navy rounded-2xl font-black text-lg hover:bg-regenesys-gold transition-all active:scale-95">
                      REQUEST PROGRAMME BROCHURE
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

export default LeadershipMastery;
