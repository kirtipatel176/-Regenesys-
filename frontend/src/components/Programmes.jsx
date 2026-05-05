import { ArrowRight, Laptop, BarChart3, Database, BrainCircuit, GraduationCap, Trophy, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const programs = [
  {
    id: "01",
    icon: <Database size={24} />,
    title: "Role Based Programmes",
    path: "/programmes/role-based",
    desc: "Training specific job roles to maximise relevance & impact. Develop precise skills required for each function."
  },
  {
    id: "02",
    icon: <BarChart3 size={24} />,
    title: "Data Zen Master",
    path: "/programmes/data-zen-master",
    desc: "Advanced data analytics & visualisation techniques. Expertise in data governance, security, & big data."
  },
  {
    id: "03",
    icon: <Laptop size={24} />,
    title: "Technology Stack",
    path: "/programmes/technology-stack",
    desc: "Foundational and advanced industry-relevant topics in current technology stack. Hands-on tools & frameworks."
  },
  {
    id: "04",
    icon: <BrainCircuit size={24} />,
    title: "Gen AI Academy",
    path: "/programmes/gen-ai-academy",
    desc: "Integration of generative AI tools to optimise business processes. AI-driven solutions to enhance data analysis."
  },
  {
    id: "05",
    icon: <GraduationCap size={24} />,
    title: "Fresher's Talent Transformation",
    path: "/programmes/freshers-talent-transformation",
    desc: "Equip fresh graduates with essential technical & soft skills. Hands-on projects & industry mentorship."
  },
  {
    id: "06",
    icon: <Trophy size={24} />,
    title: "Leadership Mastery Suite",
    path: "/programmes/leadership-mastery",
    desc: "Enhanced strategic thinking & decision-making for aspiring leaders. Foster innovation & adaptability."
  },
  {
    id: "07",
    icon: <Leaf size={24} />,
    title: "ESG Programme",
    path: "/programmes/esg",
    desc: "Master the essentials of sustainability. Lead with a global perspective on environmental & social governance."
  }
];

const Programmes = () => {
  return (
    <section id="programmes" className="py-24 lg:py-32 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 lg:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[14px] font-black uppercase tracking-[0.2em] text-regenesys-red mb-6 flex items-center justify-center gap-3"
          >
            <span className="w-8 h-[2px] bg-regenesys-red" /> Our Programmes <span className="w-8 h-[2px] bg-regenesys-red" />
          </motion.div>
          <h2 className="font-head text-[36px] lg:text-[52px] text-regenesys-navy font-bold leading-tight mb-8">
            7 Flagship Programmes
          </h2>
          <p className="text-[16px] lg:text-[18px] text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Our high-impact bespoke programmes are designed to provide a rich learning experience and to achieve the desired business outcomes in a constantly evolving landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {programs.map((prog, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#fafbfc] rounded-[2rem] p-8 lg:p-10 border border-gray-100 hover:bg-regenesys-navy hover:text-white transition-all duration-500 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-premium-xl"
            >
              {/* Number Background */}
              <div className="absolute top-4 right-8 text-[80px] font-black text-black/[0.03] group-hover:text-white/[0.05] transition-colors leading-none">
                {prog.id}
              </div>

              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-regenesys-red group-hover:text-white transition-all duration-500 relative z-10">
                {prog.icon}
              </div>
              
              <h3 className="text-[18px] lg:text-[20px] font-bold mb-6 relative z-10 leading-tight">
                {prog.title}
              </h3>
              
              <p className="text-[14px] leading-relaxed opacity-70 mb-10 flex-1 relative z-10">
                {prog.desc}
              </p>
              
              <Link 
                to={prog.path} 
                className="inline-flex items-center gap-2 font-black text-[12px] uppercase tracking-wider group-hover:gap-3 transition-all relative z-10"
              >
                Learn More <ArrowRight size={18} className="text-regenesys-red group-hover:text-white transition-colors" />
              </Link>

              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-regenesys-red rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 blur-2xl" />
            </motion.div>
          ))}
          
          {/* Custom CTA Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-regenesys-red rounded-[2rem] p-8 lg:p-10 text-white flex flex-col justify-center items-center text-center shadow-xl shadow-red-500/20"
          >
            <h3 className="text-[20px] lg:text-[24px] font-bold mb-6">Need a Bespoke Solution?</h3>
            <p className="text-[14px] text-white/80 mb-8 leading-relaxed">We customize our programmes to meet your unique organizational challenges.</p>
            <button className="bg-white text-regenesys-navy px-8 py-3 rounded-xl font-bold text-[14px] hover:bg-regenesys-navy hover:text-white transition-all shadow-lg">
              Contact Us
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Programmes;
