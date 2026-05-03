import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Clients from '../components/Clients';
import AboutUs from '../components/AboutUs';
import Programmes from '../components/Programmes';
import Lifecycle from '../components/Lifecycle';
import TheoryOfChange from '../components/TheoryOfChange';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const SuccessStoriesSection = () => {
  const [current, setCurrent] = useState(0);
  const stories = [
    {
      name: "Sandeep Kumar",
      role: "HR Head, Manufacturing Corp",
      text: "The transition from traditional training to Regenesys' digital-first approach was seamless. Our workforce engagement has increased by 40% since the implementation of the Role-Based Programmes.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      stats: "40% Engagement Increase"
    },
    {
      name: "Priya Sharma",
      role: "Director of L&D, Banking Group",
      text: "Regenesys' Gen AI Academy provided our executives with the exact tools needed to navigate the AI revolution. The curriculum is highly practical and immediate in its application.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      stats: "100+ Leaders Trained"
    }
  ];

  const next = () => setCurrent((prev) => (prev + 1) % stories.length);
  const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);

  return (
    <section className="py-24 lg:py-32 bg-[#fafbfc] px-6 lg:px-10 overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-[14px] font-black text-regenesys-red uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-regenesys-red" /> Success Stories
            </div>
            <h2 className="text-[36px] lg:text-[48px] font-head font-bold text-regenesys-navy leading-tight">
              Hear From Our Partners
            </h2>
          </div>
          <div className="flex gap-3">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-regenesys-navy hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-regenesys-navy hover:text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[3rem] shadow-premium-xl overflow-hidden border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-2/5 aspect-square lg:aspect-auto h-[300px] lg:h-[500px]">
                <img src={stories[current].image} alt={stories[current].name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full lg:w-3/5 p-8 lg:p-16 relative">
                <Quote className="absolute top-10 right-10 text-gray-50 opacity-50" size={120} strokeWidth={4} />
                <div className="relative z-10">
                  <div className="bg-regenesys-purple/5 text-regenesys-purple px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest inline-block mb-8">
                    {stories[current].stats}
                  </div>
                  <p className="text-[20px] lg:text-[24px] text-regenesys-navy font-medium leading-[1.6] mb-10 italic">
                    "{stories[current].text}"
                  </p>
                  <div>
                    <h4 className="text-[20px] font-bold text-regenesys-navy">{stories[current].name}</h4>
                    <p className="text-[14px] text-gray-500 font-bold uppercase tracking-widest mt-1">{stories[current].role}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function Home() {
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
        {/* 1. Hero Section */}
        <Hero onEnrollClick={toggleModal} />
        
        {/* 2. Clients Section */}
        <Clients />
        
        {/* 3. Programmes Section (7 Flagship Programmes) */}
        <Programmes />
        
        {/* 4. Employee Growth Partnerships (Lifecycle) */}
        <Lifecycle />
        
        {/* 5. Our Theory of Change (Methodology) */}
        <TheoryOfChange />
        
        {/* 6. About Us Section (The Corporate Education Division) */}
        <AboutUs onEnrollClick={toggleModal} />
        
        {/* 7. Success Stories Section */}
        <SuccessStoriesSection />
        
        {/* 8. High-Impact CTA Band */}
        <div className="bg-regenesys-navy py-24 px-6 lg:px-10 text-center relative overflow-hidden border-t border-white/5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-[40px] lg:text-[60px] font-head font-bold text-white mb-8 leading-tight">
              Ready to Transform <br /> Your Workforce?
            </h2>
            <p className="text-white/70 text-[18px] lg:text-[20px] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join hundreds of global enterprises that trust Regenesys for industry-leading corporate training and digital transformation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <button 
                onClick={toggleModal}
                className="bg-regenesys-red hover:bg-white hover:text-regenesys-navy text-white px-12 py-5 rounded-full font-black text-[16px] transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center gap-3 group"
              >
                ENROL YOUR TEAM <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-transparent border-2 border-white/20 hover:border-white text-white px-12 py-5 rounded-full font-black text-[16px] transition-all flex items-center justify-center">
                TALK TO AN EXPERT
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      <PrivateGPT />
    </div>
  );
}

export default Home;
