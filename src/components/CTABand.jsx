import React from 'react';

const CTABand = ({ onEnrollClick }) => {
  return (
    <section className="bg-gradient-to-r from-regenesys-navy to-regenesys-red-dark py-15 px-10 text-center relative overflow-hidden group">
      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'repeating-linear-gradient(60deg, #fff 0, #fff 1px, transparent 0, transparent 30px)', backgroundSize: '30px 30px' }} />
      
      <div className="relative z-10">
        <h2 className="font-head text-3xl md:text-[34px] text-white font-bold mb-3">Let's Get In Touch And Have A Discussion</h2>
        <p className="text-base text-white/75 mb-7">Deliver faster, collaborate better and innovate more effectively.</p>
        <button 
          onClick={onEnrollClick}
          className="bg-regenesys-gold text-regenesys-navy px-8.5 py-3.5 rounded-lg font-bold text-[15px] hover:bg-regenesys-gold-light hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(212,160,23,0.4)] transition-all"
        >
          Contact Us Today
        </button>
      </div>
    </section>
  );
};

export default CTABand;
