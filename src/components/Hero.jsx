import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

const slides = [
  {
    image: hero3,
    title1: "Glass-breaking training for the glass ceiling breakers!",
    title2: "EMPOWERING",
    title3: "WOMEN.",
    subtitle: "Empowering Leaders",
    cta: "GET STARTED"
  },
  {
    image: hero1,
    title1: "Global Leadership Excellence",
    title2: "TRANSFORM",
    title3: "TEAMS.",
    subtitle: "Strategic Growth Partner",
    cta: "LEARN MORE"
  },
  {
    image: hero2,
    title1: "Digital Transformation Academy",
    title2: "FUTURE",
    title3: "READY.",
    subtitle: "Innovate and Adapt",
    cta: "ENROL NOW"
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
    <section className="relative h-[680px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <motion.img 
            src={slides[current].image} 
            alt="Hero" 
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-regenesys-navy/80 via-regenesys-navy/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-regenesys-navy/60 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-center px-10 md:px-24">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="text-white text-lg font-medium mb-4 italic font-head">{slides[current].title1}</div>
              <h1 className="text-white font-head text-[72px] font-bold leading-[0.95] tracking-tight mb-2">
                {slides[current].title2}
              </h1>
              <h1 className="text-[#ffcc00] font-head text-[72px] font-bold leading-[0.95] tracking-tight mb-6">
                {slides[current].title3}
              </h1>
              <p className="text-white text-[28px] font-bold mb-10 tracking-tight">{slides[current].subtitle}</p>
              
              <button 
                onClick={onEnrollClick}
                className="bg-white text-regenesys-navy px-10 py-3.5 rounded-full font-bold text-[14px] hover:bg-regenesys-red hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                {slides[current].cta}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-regenesys-navy flex items-center justify-center transition-all z-20 backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-regenesys-navy flex items-center justify-center transition-all z-20 backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-24 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-10 bg-regenesys-red' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
