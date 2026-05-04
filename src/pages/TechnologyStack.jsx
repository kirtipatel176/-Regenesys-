import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Code, Layers, Globe } from 'lucide-react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';

const TechnologyStack = () => {
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
        <section className="relative min-h-[500px] flex items-center overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, #334155 1px, transparent 1px), linear-gradient(#334155 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="relative z-10 px-6 lg:px-24 max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-10 h-[2px] bg-emerald-500" />
                <span className="text-emerald-400 font-bold text-[12px] uppercase tracking-[0.3em]">Full Stack Mastery</span>
              </div>
              <h1 className="font-head text-[42px] lg:text-[72px] text-white font-bold leading-[1.1] mb-8">
                Build the <span className="text-emerald-500">Future</span> of <br/>
                Digital Innovation.
              </h1>
              <p className="text-white/60 text-lg lg:text-xl max-w-xl mb-12 leading-relaxed">
                Master foundational and advanced industry-relevant topics in the modern technology stack to lead digital transformation.
              </p>
              <button onClick={toggleModal} className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-xl active:scale-95">
                START YOUR JOURNEY
              </button>
            </motion.div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-24 lg:py-32 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500">
                  <Code className="text-emerald-600 group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-4">Hands-on Training</h3>
                <p className="text-regenesys-muted leading-relaxed">Master cutting-edge tools and frameworks for modern application development.</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500">
                  <Layers className="text-emerald-600 group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-4">System Architecture</h3>
                <p className="text-regenesys-muted leading-relaxed">Implement best practices in scalable architecture, integration, and maintenance.</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500">
                  <Globe className="text-emerald-600 group-hover:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-regenesys-navy mb-4">Industry Relevance</h3>
                <p className="text-regenesys-muted leading-relaxed">Foundational and advanced topics tailored to current global technology trends.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Visual */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-regenesys-navy text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 skew-x-12 translate-x-1/4" />
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-head text-[36px] lg:text-[56px] font-bold leading-tight mb-10">Advanced <br/><span className="text-emerald-400">Tech Stack</span> Modules</h2>
              <div className="space-y-4">
                {[
                  "Microservices & Cloud Native Design",
                  "DevOps & CI/CD Pipelines",
                  "Full-Stack Development (MERN/Java/Python)",
                  "Cybersecurity & Data Integrity",
                  "Mobile App Ecosystems"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <Check className="text-emerald-500" size={20} strokeWidth={3} />
                    <span className="text-lg font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 text-center">
                <div className="text-4xl font-black text-emerald-400 mb-2">95%</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Industry Relevance</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 text-center">
                <div className="text-4xl font-black text-emerald-400 mb-2">100%</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Practical Labs</div>
              </div>
              <div className="col-span-2 bg-emerald-600 p-10 rounded-3xl text-center">
                <p className="text-lg font-bold mb-2 italic">"Bridging the gap between theory and industrial excellence."</p>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">- Regenesys Tech Advisory</div>
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

export default TechnologyStack;
