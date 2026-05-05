import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000",
    theme: "navy",
    title1: "Regenesys Corporate Education",
    title2: "UPSKILL WITH",
    title3: "REGENESYS.",
    subtitle: "Custom upskilling programmes for employees at every career stage.",
    cta: "GET STARTED",
    highlight: "REGENESYS."
  },
  {
    theme: "purple",
    title1: "Glass-breaking training for the glass ceiling breakers!",
    title2: "EMPOWERING",
    title3: "WOMEN.",
    subtitle: "Empowering Leaders",
    cta: "GET STARTED",
    highlight: "WOMEN."
  },
  {
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2000",
    theme: "navy",
    title1: "25+ Years of Educational Legacy",
    title2: "TRANSFORM",
    title3: "TEAMS.",
    subtitle: "Strategic growth through industry-aligned corporate training.",
    cta: "LEARN MORE",
    highlight: "TEAMS."
  }
];

const Hero = ({ onEnrollClick }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className={`relative h-[600px] md:h-[700px] lg:h-[800px] w-full overflow-hidden transition-colors duration-1000 ${slides[current].theme === 'purple' ? 'bg-[#9333ea]' : 'bg-regenesys-navy'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {slides[current].image ? (
            <motion.img 
              src={slides[current].image} 
              alt="Hero" 
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, filter: "brightness(0.6)" }}
              animate={{ scale: 1, filter: "brightness(0.8)" }}
              transition={{ duration: 6, ease: "linear" }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#9333ea] via-[#7e22ce] to-[#6b21a8]" />
          )}
          
          <div className={`absolute inset-0 ${slides[current].theme === 'purple' ? 'bg-black/10' : 'bg-gradient-to-r from-regenesys-navy/80 via-regenesys-navy/30 to-transparent'}`} />
          
          <div className="relative h-full flex flex-col justify-center px-6 md:px-24">
            <div className="max-w-5xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-[16px] md:text-[24px] font-medium mb-8 flex items-center gap-4"
              >
                {slides[current].theme !== 'purple' && <span className="w-12 h-[2px] bg-regenesys-gold" />}
                {slides[current].title1}
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white font-head text-[48px] md:text-[90px] lg:text-[110px] font-black leading-[1] tracking-tight mb-2 uppercase"
              >
                {slides[current].title2}
              </motion.h1>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className={`${slides[current].theme === 'purple' ? 'text-[#facc15]' : 'text-regenesys-gold'} font-head text-[48px] md:text-[90px] lg:text-[110px] font-black leading-[1] tracking-tight mb-10 uppercase`}
              >
                {slides[current].title3}
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-white text-[24px] md:text-[42px] font-bold mb-12 max-w-3xl leading-tight"
              >
                {slides[current].subtitle}
              </motion.h2>
              
              <motion.button 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                onClick={onEnrollClick}
                className="bg-white text-regenesys-navy px-12 py-5 rounded-full font-black text-[16px] hover:bg-regenesys-red hover:text-white transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3 uppercase tracking-wider"
              >
                {slides[current].cta} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-6 md:left-12 flex items-center z-20">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-black shadow-xl hover:scale-110 transition-transform"
        >
          <ChevronLeft size={32} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-6 md:right-12 flex items-center z-20">
        <button 
          onClick={nextSlide}
          className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-black shadow-xl hover:scale-110 transition-transform"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-6 md:left-24 flex gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-12 bg-regenesys-gold shadow-lg shadow-regenesys-gold/40' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
