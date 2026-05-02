import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';
import { motion } from 'framer-motion';
import { Users, BookOpen, Clock, Award, Star } from 'lucide-react';

const stories = [
  {
    client: "Global Tech Giant",
    title: "Digital Transformation Leadership",
    description: "Empowering senior management to navigate the complexities of AI-driven market shifts.",
    metrics: [
      { label: "Batches Delivered", value: "3", icon: <BookOpen size={18} /> },
      { label: "Participants Trained", value: "270", icon: <Users size={18} /> },
      { label: "Facilitators Involved", value: "2", icon: <Star size={18} /> }
    ],
    color: "bg-blue-50"
  },
  {
    client: "Leading BFSI Firm",
    title: "Advanced Data Analytics Mastery",
    description: "Upskilling the data science team in advanced predictive modeling and governance.",
    metrics: [
      { label: "Batches Delivered", value: "3", icon: <BookOpen size={18} /> },
      { label: "Participants Trained", value: "54", icon: <Users size={18} /> },
      { label: "Total Training Hours", value: "510", icon: <Clock size={18} /> }
    ],
    color: "bg-green-50"
  },
  {
    client: "Manufacturing Leader",
    title: "Operational Excellence Program",
    description: "Implementing Lean Six Sigma methodologies across regional manufacturing hubs.",
    metrics: [
      { label: "Batches Delivered", value: "1", icon: <BookOpen size={18} /> },
      { label: "Participants Trained", value: "20", icon: <Users size={18} /> },
      { label: "Total Training Hours", value: "40", icon: <Clock size={18} /> }
    ],
    color: "bg-purple-50"
  },
  {
    client: "Top Pharmaceutical Co.",
    title: "ESG & Ethical Governance",
    description: "Integrating sustainability reporting and ethical frameworks into corporate strategy.",
    metrics: [
      { label: "Batches Delivered", value: "1", icon: <BookOpen size={18} /> },
      { label: "Participants Trained", value: "10", icon: <Users size={18} /> },
      { label: "Facilitators Involved", value: "60", icon: <Star size={18} /> }
    ],
    color: "bg-yellow-50"
  }
];

const SuccessStories = () => {
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
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-10 bg-regenesys-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <div className="grid grid-cols-12 h-full w-full">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border-r border-white/10 h-full" />
              ))}
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-[56px] font-bold text-white leading-tight font-head">
                Transforming Leaders and <br />
                <span className="text-[#ffcc00]">Innovators</span> Across Industries
              </h1>
              <p className="text-white/60 text-lg max-w-4xl mx-auto leading-relaxed">
                Regenesys Corporate Education believes in empowering organisations and individuals with cutting-edge knowledge and skills that drive performance and innovation. Our impactful training programmes have successfully delivered measurable results across 2000+ participants.
              </p>
              <button 
                onClick={toggleModal}
                className="bg-white text-regenesys-navy px-10 py-4 rounded-full font-bold text-[14px] hover:bg-[#ffcc00] transition-all shadow-2xl"
              >
                GET STARTED
              </button>
            </motion.div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center mb-20">
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="text-[40px] font-black text-regenesys-navy mb-1">2000+</div>
                <div className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Participants</div>
              </div>
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="text-[40px] font-black text-regenesys-navy mb-1">100+</div>
                <div className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Batches</div>
              </div>
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="text-[40px] font-black text-regenesys-navy mb-1">5000+</div>
                <div className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Training Hours</div>
              </div>
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="text-[40px] font-black text-regenesys-navy mb-1">98%</div>
                <div className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Satisfaction</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {stories.map((story, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-10 rounded-[40px] ${story.color} border border-black/5 hover:shadow-2xl transition-all group`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-[#008444] font-bold text-[12px] uppercase tracking-[3px] mb-2">{story.client}</div>
                      <h3 className="text-[28px] font-bold text-regenesys-navy leading-tight group-hover:text-black transition-colors">{story.title}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-regenesys-navy shadow-sm">
                      <Award size={24} />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-10 leading-relaxed text-[15px]">
                    {story.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-black/5">
                    {story.metrics.map((m, idx) => (
                      <div key={idx}>
                        <div className="flex items-center gap-2 text-regenesys-navy/60 mb-1">
                          {m.icon}
                          <span className="text-[20px] font-black text-regenesys-navy">{m.value}</span>
                        </div>
                        <div className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="py-20 bg-gray-50 text-center px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[32px] font-bold text-regenesys-navy mb-6">Start Your Transformative Journey Today</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Join the ranks of global leaders who have transformed their organizations through our partnership. Connect with our experts to design your bespoke learning path.
            </p>
            <button 
              onClick={toggleModal}
              className="bg-regenesys-navy text-white px-12 py-4 rounded-full font-bold text-[14px] hover:bg-black transition-all shadow-xl"
            >
              UPSKILL YOUR TEAM
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      <PrivateGPT />
    </div>
  );
};

export default SuccessStories;
