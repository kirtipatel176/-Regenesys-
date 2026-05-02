import React from 'react';
import { ArrowRight, Laptop, BarChart3, Database, BrainCircuit, GraduationCap, Trophy, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const programs = [
  {
    icon: <Database className="text-blue-600" />,
    title: "Role Based Programmes",
    items: [
      "Training specific job roles to maximise relevance & impact.",
      "Develop precise skills & knowledge required for each role."
    ]
  },
  {
    icon: <BarChart3 className="text-blue-600" />,
    title: "Data Zen Master",
    items: [
      "Advanced data analytics & visualisation techniques to drive business insights.",
      "Expertise in data governance, security, & ethical considerations.",
      "Skills to leverage big data technologies for strategic decision-making."
    ]
  },
  {
    icon: <Laptop className="text-blue-600" />,
    title: "Technology Stack",
    items: [
      "Foundational and advanced industry-relevant topics in the current technology stack.",
      "Hands-on training in using cutting-edge tools & frameworks for development.",
      "Best practices in system architecture, integration, & maintenance."
    ]
  },
  {
    icon: <BrainCircuit className="text-blue-600" />,
    title: "Gen AI Academy",
    items: [
      "Integration of generative AI tools to optimise business processes.",
      "AI-driven solutions to enhance data analysis and decision-making.",
      "Practical knowledge of implementing AI strategies across business functions."
    ]
  },
  {
    icon: <GraduationCap className="text-blue-600" />,
    title: "Fresher's Talent Transformation Programme",
    items: [
      "Equip fresh graduates with essential technical & soft skills.",
      "Hands-on projects & simulations to apply academic knowledge in the real world.",
      "Mentorship from industry experts to guide early career development."
    ]
  },
  {
    icon: <Trophy className="text-blue-600" />,
    title: "Leadership Mastery Suite",
    items: [
      "Enhanced strategic thinking & decision-making skills for aspiring leaders.",
      "Advanced communication and team management abilities.",
      "Foster innovation & adaptability to lead effectively in dynamic business environments."
    ]
  },
  {
    icon: <Leaf className="text-blue-600" />,
    title: "ESG",
    items: [
      "Training to Master the essentials of sustainability",
      "Drive impactful change with practical ESG strategies.",
      "Lead with a global perspective on environmental and social governance."
    ]
  }
];

const Programmes = () => {
  return (
    <section id="programmes" className="py-20 px-10">
      <div className="text-center mb-16">
        <div className="text-[11px] font-mono uppercase tracking-[2px] text-regenesys-red mb-2.5">Our Programmes</div>
        <h2 className="font-head text-4xl text-regenesys-navy font-bold leading-tight mb-4">Programmes Designed For Organisational Success</h2>
        <p className="text-[15px] text-regenesys-muted leading-relaxed max-w-3xl mx-auto">
          Our high-impact bespoke programmes are designed to provide a rich learning experience and to achieve the desired business outcomes in a constantly evolving landscape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {programs.map((prog, i) => (
          <div key={i} className="bg-white border border-regenesys-border rounded-xl p-8 flex flex-col hover:shadow-premium transition-all duration-300 reveal group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              {prog.icon}
            </div>
            
            <h3 className="text-[16px] font-bold text-regenesys-navy mb-4 h-12 flex items-center">{prog.title}</h3>
            
            <ul className="space-y-3 mb-8 flex-1">
              {prog.items.map((item, idx) => (
                <li key={idx} className="text-[13px] text-regenesys-muted pl-4 relative leading-relaxed">
                  <span className="absolute left-0 text-blue-500 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            
            <Link 
              to={prog.title === "Role Based Programmes" ? "/programmes/role-based" : "#"} 
              className="text-blue-600 text-[13px] font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Programmes;
