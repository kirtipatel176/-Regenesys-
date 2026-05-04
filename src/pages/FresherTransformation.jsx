import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Rocket, BookOpen, Users, Star } from 'lucide-react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';

const FresherTransformation = () => {
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
        <section className="relative min-h-[550px] flex items-center overflow-hidden bg-gradient-to-br from-regenesys-red to-regenesys-red-dark">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 px-6 lg:px-24 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white"
              >
                <div className="inline-block px-4 py-1 bg-white/20 rounded-lg mb-8 backdrop-blur-sm border border-white/10">
                  <span className="text-white font-black text-[12px] uppercase tracking-widest">Bridge the Gap</span>
                </div>
                <h1 className="font-head text-[40px] lg:text-[68px] font-bold leading-tight mb-8">
                  From Campus to <br/>
                  <span className="text-regenesys-gold italic underline decoration-white/20 underline-offset-8">Corporate Excellence.</span>
                </h1>
                <p className="text-white/80 text-lg lg:text-xl max-w-lg mb-10 leading-relaxed font-medium">
                  Equip fresh graduates with essential technical and soft skills through intensive industry-led training and real-world simulations.
                </p>
                <button onClick={toggleModal} className="bg-white text-regenesys-red px-12 py-4 rounded-full font-black text-[15px] hover:bg-regenesys-navy hover:text-white transition-all shadow-premium-2xl active:scale-95">
                  ENROL NOW
                </button>
              </motion.div>
              <div className="hidden lg:block relative">
                <div className="w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl absolute -top-20 -right-20" />
                <div className="bg-white/5 backdrop-blur-md p-10 rounded-[60px] border border-white/10">
                  <div className="space-y-8">
                    {[
                      { icon: Rocket, title: "Hire-Train-Deploy", desc: "Our unique methodology to ensure day-one readiness." },
                      { icon: BookOpen, title: "Soft Skills Mastery", desc: "Communication, Etiquette, and Leadership for early careers." },
                      { icon: Users, title: "Industry Mentorship", desc: "Direct guidance from global corporate veterans." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                          <item.icon size={28} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Steps */}
        <section className="py-24 lg:py-32 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-head text-[32px] lg:text-[48px] text-regenesys-navy font-bold leading-tight mb-6">Talent Transformation Journey</h2>
              <p className="text-regenesys-muted text-lg max-w-2xl mx-auto">A structured pathway designed to transform raw potential into high-performing corporate assets.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { step: "01", title: "Assessment", desc: "Identifying core strengths and technical gaps." },
                { step: "02", title: "Immersion", desc: "Intensive 8-week technical & soft skill bootcamp." },
                { step: "03", title: "Simulation", desc: "Handling real projects in a safe sandbox environment." },
                { step: "04", title: "Placement", desc: "Seamless deployment into target business units." }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="text-[120px] font-black text-gray-50 absolute -top-16 left-0 -z-10 group-hover:text-regenesys-red/5 transition-colors">{item.step}</div>
                  <h3 className="text-2xl font-bold text-regenesys-navy mb-4 pt-10">{item.title}</h3>
                  <p className="text-regenesys-muted text-[15px] leading-relaxed">{item.desc}</p>
                  <div className="mt-8 h-1 w-0 bg-regenesys-red group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-square">
               <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000" alt="Training" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-regenesys-navy/30" />
            </div>
            <div>
              <h2 className="font-head text-[32px] lg:text-[44px] text-regenesys-navy font-bold mb-10 leading-tight">Key Learning Outcomes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  "Professional Communication",
                  "Agile Project Management",
                  "Problem Solving Frameworks",
                  "Team Collaboration",
                  "Industry Specific Tech",
                  "Data Literacy Foundations"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Check className="text-[#008444]" size={18} strokeWidth={3} />
                    <span className="text-[14px] font-bold text-regenesys-navy/80">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-8 bg-regenesys-gold/10 rounded-3xl border border-regenesys-gold/20 flex items-center gap-6">
                <Star className="text-regenesys-gold" size={40} fill="currentColor" />
                <div>
                  <div className="text-lg font-bold text-regenesys-navy">100% Day-One Ready</div>
                  <div className="text-sm text-regenesys-muted">Our alumni consistently outperform peers in probation metrics.</div>
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

export default FresherTransformation;
