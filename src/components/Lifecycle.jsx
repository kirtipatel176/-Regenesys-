import React from 'react';
import icon1 from '../assets/icons/image.png';
import icon2 from '../assets/icons/image copy.png';
import icon3 from '../assets/icons/image copy 2.png';
import icon4 from '../assets/icons/image copy 3.png';
import icon5 from '../assets/icons/image copy 4.png';

const stages = [
  {
    title: "Campus Partnerships",
    icon: icon1,
    color: "bg-[#4570c9]",
    items: ["Hire", "Train", "Deploy", "Pre-Boarding", "Technical Hiring"]
  },
  {
    title: "Early Career Development",
    icon: icon2,
    color: "bg-[#4570c9]",
    items: ["Onboarding", "Technical Skills Training", "Role-Specific Hiring", "Mentorship Programs", "Career Pathway Planning"]
  },
  {
    title: "Management Development",
    icon: icon3,
    color: "bg-[#4570c9]",
    items: ["First-Time Manager Training", "Top Talent Programs", "Manager Development Workshops", "Data & Technology Capability Building", "Diversity and Inclusion Initiatives"]
  },
  {
    title: "Leadership Growth",
    icon: icon4,
    color: "bg-[#4570c9]",
    items: ["Leadership Development Programs", "Women in Leadership Initiatives", "Digital Leadership Training", "Executive Coaching", "Leadership Succession Planning"]
  },
  {
    title: "CXO and Executive Strategy",
    icon: icon5,
    color: "bg-[#4570c9]",
    items: ["Succession Planning", "Business Transformation Initiatives", "Digital Literacy and Strategy", "Change Management", "Strategic Vision Development"]
  }
];

const Lifecycle = () => {
  return (
    <section id="lifecycle" className="py-24 px-10 bg-[#f8f9fc]">
      <div className="text-center mb-16">
        <div className="text-[11px] font-mono uppercase tracking-[2px] text-[#008444] mb-3 font-bold">Employee Life Cycle</div>
        <h2 className="font-head text-[38px] text-regenesys-navy font-bold leading-tight">Employee Growth Partnerships</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0.5 max-w-[1280px] mx-auto border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {stages.map((stage, i) => (
          <div key={i} className="bg-white flex flex-col h-full reveal group">
            <div className={`${stage.color} p-6 flex flex-col items-center text-center text-white min-h-[140px] justify-center`}>
              <div className="mb-4 opacity-100 transition-transform group-hover:scale-110 duration-500">
                <img src={stage.icon} alt={stage.title} className="w-8 h-8 object-contain invert brightness-0" />
              </div>
              <h3 className="text-[12px] font-extrabold leading-tight uppercase tracking-widest">{stage.title}</h3>
            </div>
            <div className="p-8 flex-1">
              <ul className="space-y-4">
                {stage.items.map((item, idx) => (
                  <li key={idx} className="text-[12px] text-regenesys-muted pl-4 relative leading-relaxed group-hover:text-regenesys-navy transition-colors">
                    <span className="absolute left-0 text-[#c0392b] font-bold text-lg -top-1.5">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Lifecycle;
