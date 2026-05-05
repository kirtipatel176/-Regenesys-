import aboutImg from '../assets/about.png';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: "25+", label: "Years of Educational Legacy" },
  { value: "1000 +", label: "Global Industry Experts & Mentors" },
  { value: "89 %", label: "Client Retention Rate" },
  { value: "150 +", label: "Corporate Projects Completed" }
];

const AboutUs = ({ onEnrollClick }) => {
  return (
    <>
      {/* About Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="rounded-[2.5rem] overflow-hidden shadow-premium-2xl border-8 border-gray-50">
                <img 
                  src={aboutImg} 
                  alt="Regenesys Corporate Education" 
                  className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-regenesys-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            </motion.div>

            {/* Text */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-10 h-[2px] bg-regenesys-red" />
                <span className="text-[14px] font-black text-regenesys-red uppercase tracking-widest">About Us</span>
              </div>
              <h2 className="font-head text-[36px] lg:text-[52px] text-regenesys-navy font-bold leading-[1.1] mb-8">
                THE CORPORATE <br /> EDUCATION DIVISION
              </h2>
              <p className="text-[16px] lg:text-[18px] text-regenesys-navy font-bold mb-6 leading-relaxed">
                25+ Years of Legacy in Holistic Education
              </p>
              <div className="space-y-5 mb-10">
                <p className="text-[15px] lg:text-[16px] text-regenesys-muted leading-[1.8]">
                  Regenesys, a Global Educational Institution brings its ground-breaking corporate training expertise through Regenesys Corporate Education, offering a broad spectrum of industry-specific training and learning programmes for IT/ITES, BPO, GCC, and others.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {[
                    "Bespoke Training Solutions",
                    "Global Faculty Network",
                    "Industry-Aligned Curriculum",
                    "Customized Learning Paths"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="text-regenesys-purple shrink-0" size={20} />
                      <span className="text-[14px] font-bold text-regenesys-navy">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={onEnrollClick}
                className="bg-regenesys-navy text-white px-10 py-4 rounded-full font-bold text-[14px] hover:bg-regenesys-purple transition-all shadow-xl shadow-regenesys-navy/10"
              >
                DISCOVER MORE
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-20 lg:py-24 px-6 lg:px-10 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center lg:text-left"
              >
                <div className="text-[44px] lg:text-[56px] font-black text-regenesys-navy leading-none mb-3 tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-[13px] lg:text-[14px] text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
