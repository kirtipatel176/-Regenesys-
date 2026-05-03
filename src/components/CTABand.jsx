import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTABand = ({ onEnrollClick }) => {
  return (
    <section className="relative py-16 lg:py-20 px-6 lg:px-10 bg-regenesys-navy overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-head text-[24px] md:text-[34px] text-white font-bold mb-4 leading-tight">
          Let's Get In Touch And Have A Discussion
        </h2>
        <p className="text-[14px] md:text-[15px] text-white/50 mb-8 max-w-2xl mx-auto">
          Deliver faster, collaborate better and innovate more effectively.
        </p>
        <button 
          onClick={onEnrollClick}
          className="bg-regenesys-purple text-white px-10 py-3.5 rounded-lg font-bold text-[14px] hover:bg-regenesys-purple-dark transition-all active:scale-95 inline-flex items-center gap-2 group"
        >
          Contact Us <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default CTABand;
