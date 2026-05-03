import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const steps = [
  { 
    id: "learning",
    step: "LEARNING", 
    desc: "To get familiar with key concepts and frameworks",
    gradient: "from-[#818cf8] to-[#6366f1]"
  },
  { 
    id: "application",
    step: "APPLICATION", 
    desc: "To consistently practise and track growth with rituals and actions",
    gradient: "from-[#7c7cf8] to-[#5b5be8]"
  },
  { 
    id: "experience",
    step: "EXPERIENCE", 
    desc: "To deeply engage through memorable tools and immersions",
    gradient: "from-[#7575f5] to-[#5252e0]"
  },
  { 
    id: "coaching",
    step: "COACHING", 
    desc: "To personalise growth with individual plans and support",
    gradient: "from-[#6e6ef2] to-[#4a4ad8]"
  },
  { 
    id: "reinforcement",
    step: "REINFORCEMENT", 
    desc: "To ensure learning sticks through post-program boosters",
    gradient: "from-[#6767ef] to-[#4242d0]"
  }
];

const TheoryOfChange = () => {
  const [activeStep, setActiveStep] = useState("experience");

  return (
    <section id="methodology" className="py-20 lg:py-32 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="font-head text-[28px] lg:text-[44px] text-regenesys-navy font-bold leading-tight mb-5">Our Theory of Change</h2>
          <p className="text-[14px] lg:text-[16px] text-regenesys-muted leading-relaxed max-w-3xl mx-auto">
            Innovative teaching methods that set industry standards foster exceptional student engagement and create tangible real-world impact in today's ever-changing workplaces.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-1 max-w-[1200px] mx-auto h-auto lg:h-[480px] overflow-hidden rounded-3xl shadow-premium-lg">
          {steps.map((s) => {
            const isActive = activeStep === s.id;
            return (
              <motion.div 
                key={s.id}
                layout
                onMouseEnter={() => setActiveStep(s.id)}
                onClick={() => setActiveStep(s.id)}
                className={`relative cursor-pointer transition-all duration-500 flex flex-col items-center
                  ${isActive 
                    ? `flex-[3] bg-gradient-to-b ${s.gradient}` 
                    : 'flex-1 bg-[#eef0ff] hover:bg-[#e5e7ff]'
                  }`}
              >
                {/* Arrow icon */}
                <div className="pt-6 lg:pt-10 pb-4">
                  <ArrowUp 
                    size={22} 
                    className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-regenesys-navy/25'}`} 
                    strokeWidth={1.5} 
                  />
                </div>

                {/* Content */}
                <div className="flex-1 w-full flex flex-col items-center justify-center px-4 pb-8">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div 
                        key="active"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-white text-center"
                      >
                        <h3 className="text-[28px] lg:text-[36px] font-black tracking-tight mb-3 uppercase leading-none">{s.step}</h3>
                        <p className="text-[13px] lg:text-[15px] opacity-85 leading-relaxed max-w-[260px] mx-auto font-medium">{s.desc}</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="inactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="lg:vertical-text font-bold text-regenesys-navy/60 text-[18px] lg:text-[24px] tracking-[5px] lg:tracking-[8px]"
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
      </div>
    </section>
  );
};

export default TheoryOfChange;
