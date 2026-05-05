import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Play, ArrowRight, Building2, HeartPulse, Landmark, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const featuredSeries = [
  { 
    name: "Insurance", 
    icon: <ShieldCheck size={18} />, 
    desc: "The Future of HR in the New Digital Age for the Insurance Sector" 
  },
  { 
    name: "Banking", 
    icon: <Landmark size={18} />, 
    desc: "The Future of HR in the New Digital Age for the Banking Sector" 
  },
  { 
    name: "Manufacturing", 
    icon: <Building2 size={18} />, 
    desc: "The Future of HR in the New Digital Age for the Manufacturing Sector" 
  },
  { 
    name: "NBFC", 
    icon: <Landmark size={18} />, 
    desc: "The Future of HR in the New Digital Age for the NBFC Sector" 
  },
  { 
    name: "BFSI", 
    icon: <ShieldCheck size={18} />, 
    desc: "The Future of HR in the New Digital Age for the BFSI Sector" 
  },
  { 
    name: "Healthcare", 
    icon: <HeartPulse size={18} />, 
    desc: "The Future of HR in the New Digital Age for the Healthcare Sector" 
  }
];

const speakers = [
  { name: "Dhruv", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
  { name: "Anirudh Gupta", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
  { name: "Aditi Arora", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" },
  { name: "Anand Kulkarni", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
  { name: "Bipin L", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400" }
];

const webinars = [
  {
    month: "January",
    title: "Restart, Rebuild, Rise: Empowering Women",
    date: "15th",
    region: "India",
    brief: "Dedicated to addressing the challenges women face when re-entering the workforce after a career break.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  },
  {
    month: "February",
    title: "Mastering Human-Centric Leadership",
    date: "22nd",
    region: "Global",
    brief: "Balancing technological advancements with empathy, inclusivity, and employee well-being.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
  }
];

const Events = () => {
  const [activeSpeaker, setActiveSpeaker] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpeaker((prev) => (prev + 1) % speakers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Corporate Events & Webinars" 
        description="Join our exclusive corporate webinars and event series focused on HR trends, digital transformation, and leadership excellence."
      />
      <TopBar />
      <Navbar />
      
      {/* Hero Section - Exactly as in Screenshot */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 px-6 lg:px-10 overflow-hidden bg-white flex flex-col items-center">
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -translate-x-1/2" />
        
        {/* Get Started Button at the top */}
        <button className="bg-[#4a72f5] hover:bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold text-[13px] transition-all shadow-lg mb-12">
          Get Started
        </button>

        {/* Video Thumbnail Gallery - Auto Animated */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-4 lg:gap-8 mb-10 h-[400px] relative">
          {speakers.map((s, i) => {
            const isActive = i === activeSpeaker;
            const isPrev = i === (activeSpeaker - 1 + speakers.length) % speakers.length;
            const isNext = i === (activeSpeaker + 1) % speakers.length;
            
            return (
              <motion.div 
                key={i}
                animate={{ 
                  scale: isActive ? 1.1 : 0.85,
                  x: (i - activeSpeaker) * 20,
                  opacity: (isActive || isPrev || isNext) ? 1 : 0.4,
                  filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
                  zIndex: isActive ? 10 : 5
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute rounded-[2rem] overflow-hidden shadow-premium-lg shrink-0 cursor-pointer
                  ${isActive ? 'w-56 h-80 lg:w-72 lg:h-96' : 'w-40 h-64 lg:w-48 lg:h-72'}`}
                onClick={() => setActiveSpeaker(i)}
              >
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Play Button */}
                <div className="absolute bottom-4 right-4 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center text-regenesys-navy shadow-xl">
                  <Play size={18} fill="currentColor" />
                </div>
                
                {/* Name */}
                <div className="absolute bottom-6 left-6 text-white font-bold text-[14px] lg:text-[18px]">
                  {s.name}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Indicators */}
        <div className="flex gap-2 mb-20 relative z-20">
          {speakers.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSpeaker(i)}
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 
                ${activeSpeaker === i ? 'bg-regenesys-purple border-regenesys-purple ring-2 ring-regenesys-purple/20' : 'bg-transparent border-regenesys-navy/30'}`} 
            />
          ))}
        </div>

        {/* Featured Event Series Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[32px] lg:text-[38px] font-head font-bold text-regenesys-navy mb-6">Featured Event Series</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            These event series was designed to explore the future of HR in various sectors. This session offered a unique opportunity to network with industry experts, learn innovative HR practices, and discover how to lead in the evolving sectors.
          </p>
        </div>

        {/* Event Series Grid - Match Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-24">
          {featuredSeries.map((s, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }} 
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium-sm hover:shadow-premium-lg transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-regenesys-purple flex items-center justify-center mb-6">
                {s.icon}
              </div>
              <h4 className="text-[14px] font-black text-regenesys-navy uppercase tracking-widest mb-3">{s.name}</h4>
              <p className="text-[13px] text-gray-400 leading-relaxed font-medium">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[32px] lg:text-[38px] font-head font-bold text-regenesys-navy mb-6">How It Works</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            Follow These Simple Steps to Register and Join Our Webinars: Check Guidelines for Attendees and Panellists
          </p>
        </div>
      </section>

      {/* Main Webinars List */}
      <section className="py-20 bg-[#fafbfc] px-6 lg:px-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-10">
            {webinars.map((w, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row items-center gap-10 p-8 bg-white rounded-[3rem] border border-gray-100 shadow-premium-sm"
              >
                <div className="w-full lg:w-1/2 aspect-[16/10] rounded-[2rem] overflow-hidden shadow-lg relative group">
                  <img src={w.image} alt={w.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-regenesys-navy shadow-2xl">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-regenesys-purple/10 text-regenesys-purple px-4 py-1.5 rounded-full text-[12px] font-black tracking-widest">{w.month}</span>
                    <div className="flex items-center gap-2 text-gray-400 text-[12px] font-bold">
                      <MapPin size={14} /> {w.region}
                    </div>
                  </div>
                  <h3 className="text-[28px] lg:text-[32px] font-head font-bold text-regenesys-navy leading-tight mb-6">{w.title}</h3>
                  <p className="text-gray-500 text-[16px] leading-relaxed mb-8">{w.brief}</p>
                  <button className="bg-regenesys-navy text-white px-8 py-3 rounded-xl font-bold text-[14px] hover:bg-regenesys-purple transition-all flex items-center gap-2">
                    Register Now! <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
