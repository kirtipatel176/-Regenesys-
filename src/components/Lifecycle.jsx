import React from 'react';
import { motion } from 'framer-motion';
import icon1 from '../assets/icons/image.png';
import icon2 from '../assets/icons/image copy.png';
import icon3 from '../assets/icons/image copy 2.png';
import icon4 from '../assets/icons/image copy 3.png';
import icon5 from '../assets/icons/image copy 4.png';

const stages = [
  {
    title: "Campus Partnerships",
    icon: icon1,
    items: ["Hire", "Train", "Deploy", "Pre-Boarding", "Technical Hiring"]
  },
  {
    title: "Early Career Development",
    icon: icon2,
    items: ["Onboarding", "Technical Skills Training", "Role-Specific Hiring", "Mentorship Programs", "Career Pathway Planning"]
  },
  {
    title: "Management Development",
    icon: icon3,
    items: ["First-Time Manager Training", "Top Talent Programs", "Manager Development Workshops", "Data & Technology Capability Building", "Diversity and Inclusion Initiatives"]
  },
  {
    title: "Leadership Growth",
    icon: icon4,
    items: ["Leadership Development Programs", "Women in Leadership Initiatives", "Digital Leadership Training", "Executive Coaching", "Leadership Succession Planning"]
  },
  {
    title: "CXO and Executive Strategy",
    icon: icon5,
    items: ["Succession Planning", "Business Transformation Initiatives", "Digital Literacy and Strategy", "Change Management", "Strategic Vision Development"]
  }
];

const Lifecycle = () => {
  return (
    <section id="lifecycle" className="py-20 lg:py-32 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-20">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-regenesys-purple mb-4">Employee Life Cycle</div>
          <h2 className="font-head text-[28px] lg:text-[38px] text-regenesys-navy font-bold leading-tight">Employee Growth Partnerships</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0">
          {stages.map((stage, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-white h-full flex flex-col border border-gray-100 lg:border-r-0 last:lg:border-r rounded-2xl lg:rounded-none lg:first:rounded-l-2xl lg:last:rounded-r-2xl overflow-hidden hover:shadow-premium-lg transition-all duration-500 hover:z-10">
                {/* Header */}
                <div className="bg-regenesys-navy p-6 lg:p-8 flex flex-col items-center text-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
                  <div className="relative z-10">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-500">
                      <img src={stage.icon} alt={stage.title} className="w-9 h-9 object-contain brightness-0 invert" />
                    </div>
                    <h3 className="text-[11px] font-bold leading-tight uppercase tracking-[0.15em]">{stage.title}</h3>
                  </div>
                </div>
                {/* Items */}
                <div className="p-6 lg:p-7 flex-1">
                  <ul className="space-y-3">
                    {stage.items.map((item, idx) => (
                      <li key={idx} className="text-[12px] text-regenesys-muted leading-relaxed pl-4 relative group-hover:text-regenesys-navy transition-colors duration-300">
                        <span className="absolute left-0 top-0.5 w-1.5 h-1.5 rounded-full bg-regenesys-navy/20 group-hover:bg-regenesys-red transition-colors" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lifecycle;
