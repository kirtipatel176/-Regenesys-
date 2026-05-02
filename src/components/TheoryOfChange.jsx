import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const steps = [
  { 
    id: "learning",
    step: "LEARNING", 
    desc: "To get familiar with key concepts and frameworks",
    bgColor: "bg-[#f1f1ff]",
    activeColor: "bg-[#6366f1]"
  },
  { 
    id: "application",
    step: "APPLICATION", 
    desc: "To consistently practise and track growth with rituals and actions",
    bgColor: "bg-[#e8e8ff]",
    activeColor: "bg-[#6366f1]"
  },
  { 
    id: "experience",
    step: "EXPERIENCE", 
    desc: "To deeply engage through memorable tools and immersions",
    bgColor: "bg-[#e0e0ff]",
    activeColor: "bg-[#6366f1]"
  },
  { 
    id: "coaching",
    step: "COACHING", 
    desc: "To personalise growth with individual plans and support",
    bgColor: "bg-[#d8d8ff]",
    activeColor: "bg-[#6366f1]"
  },
  { 
    id: "reinforcement",
    step: "REINFORCEMENT", 
    desc: "To ensure learning sticks through post-program boosters",
    bgColor: "bg-[#d0d0ff]",
    activeColor: "bg-[#6366f1]"
  }
];

const TheoryOfChange = () => {
  const [activeStep, setActiveStep] = useState("experience");

  return (
    <section id="methodology" className="py-24 px-10 bg-[#f8f9fc]">
      <div className="text-center mb-16">
        <h2 className="font-head text-[40px] text-regenesys-navy font-bold leading-tight mb-5">Our Theory of Change</h2>
        <p className="text-[15px] text-regenesys-muted leading-relaxed max-w-3xl mx-auto">
          Innovative teaching methods that set industry standards foster exceptional student engagement and create tangible real-world impact in today's <span className="text-[#008444] border-b border-[#008444]/30">ever-changing workplaces</span>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-0.5 max-w-[1200px] mx-auto h-[460px] overflow-hidden rounded-2xl shadow-sm">
        {steps.map((s) => {
          const isActive = activeStep === s.id;
          return (
            <motion.div 
              key={s.id}
              layout
              onMouseEnter={() => setActiveStep(s.id)}
              className={`relative cursor-pointer transition-all duration-500 flex flex-col items-center
                ${isActive ? 'flex-[2.5] ' + s.activeColor : 'flex-1 ' + s.bgColor}`}
            >
              <div className="pt-12 pb-8">
                <ArrowUp 
                  size={32} 
                  className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-regenesys-navy/30'}`} 
                  strokeWidth={1.5} 
                />
              </div>

              <div className="flex-1 w-full flex flex-col items-center justify-center px-4">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div 
                      key="active"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-white text-center"
                    >
                      <h3 className="text-[34px] font-bold tracking-tight mb-3 uppercase leading-none">{s.step}</h3>
                      <p className="text-[14px] opacity-90 leading-snug max-w-[240px] mx-auto font-medium">{s.desc}</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="inactive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="vertical-text font-bold text-regenesys-navy text-[26px] tracking-[6px] opacity-80"
                    >
                      {s.step}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TheoryOfChange;
