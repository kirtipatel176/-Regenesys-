import React from 'react';
import regenesysOffice from '../assets/regenesys_office.png';

const stats = [
  { value: "1000 +", label: "Global Industry Experts & Mentors" },
  { value: "89 %", label: "Client Retention" },
  { value: "150 +", label: "Projects completed" },
  { value: "10000 +", label: "Alumni Network" }
];

const AboutUs = ({ onEnrollClick }) => {
  return (
    <section id="about" className="py-20 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 reveal">
          <div className="rounded-3xl overflow-hidden shadow-premium-lg">
            <img src={regenesysOffice} alt="Regenesys Office" className="w-full h-full object-cover aspect-[4/3]" />
          </div>
          <div>
            <h2 className="font-head text-4xl text-regenesys-navy font-bold leading-tight mb-6">About Us</h2>
            <p className="text-[16px] text-regenesys-muted leading-relaxed mb-6">
              Regenesys, a Global educational institution with a legacy of 25+ years of providing quality and holistic education, brings its groundbreaking corporate training expertise through Regenesys Corporate Education, which offers a broad spectrum of Industry-specific training and learning programmes for IT/ITES, BFSI, GCCs, and others. Along with this, we also provide customised corporate education programmes for senior, middle, and junior executives in the business, government, non-profit, and state-owned enterprise sectors.
            </p>
            <button 
              onClick={onEnrollClick}
              className="bg-regenesys-red text-white px-10 py-3 rounded-full font-bold text-[14px] hover:bg-regenesys-red-dark transition-all shadow-lg"
            >
              Get In Touch
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-regenesys-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="text-[32px] font-bold text-[#4570c9] mb-2">{s.value}</div>
              <div className="text-[13px] text-regenesys-muted font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
