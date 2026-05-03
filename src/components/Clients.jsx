import React from 'react';
import logo1 from '../assets/image.png';
import logo2 from '../assets/image copy.png';
import logo3 from '../assets/image copy 2.png';
import logo4 from '../assets/image copy 3.png';
import logo5 from '../assets/image copy 4.png';

const clients = [
  { name: "Aditya Birla Hindalco", logo: logo1 },
  { name: "CRISIL", logo: logo2 },
  { name: "Aditya Birla Group", logo: logo3 },
  { name: "APAR", logo: logo4 },
  { name: "Bajaj Markets", logo: logo5 },
];

const Clients = () => {
  return (
    <section className="py-14 lg:py-20 bg-[#fafbfc] overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-10 lg:mb-14">
        <div className="text-[11px] font-bold text-regenesys-purple uppercase tracking-[0.25em] mb-3">Our Clients</div>
        <h2 className="font-head text-[26px] lg:text-[38px] text-regenesys-navy font-bold leading-tight">Trusted By Leading Companies</h2>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="animate-scroll-x flex items-center gap-16 lg:gap-24 whitespace-nowrap py-6">
          {[...clients, ...clients, ...clients, ...clients].map((client, index) => (
            <div key={index} className="flex items-center justify-center min-w-[140px] lg:min-w-[180px]">
              <img 
                src={client.logo} 
                alt={client.name} 
                className="h-8 lg:h-12 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
