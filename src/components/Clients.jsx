import React from 'react';

const clients = [
  { name: "Bajaj Markets", logo: "https://www.bajajfinservmarkets.in/content/dam/bajajfinserv/markets/logos/bajaj-markets-logo.png" },
  { name: "Aditya Birla Hindalco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Hindalco_Logo.svg/2560px-Hindalco_Logo.svg.png" },
  { name: "CRISIL", logo: "https://www.crisil.com/content/dam/crisil/images/crisil-logo.png" },
  { name: "Aditya Birla Group", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/Aditya_Birla_Group_Logo.svg/1200px-Aditya_Birla_Group_Logo.svg.png" },
  { name: "APAR", logo: "https://www.apar.com/wp-content/uploads/2021/04/apar-logo.png" }
];

const Clients = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 text-center mb-16">
        <div className="text-[12px] font-bold text-[#4570c9] uppercase tracking-[2px] mb-4">OUR CLIENTS</div>
        <h2 className="font-head text-[40px] text-regenesys-navy font-bold leading-tight">Trusted By Leading Companies</h2>
      </div>
      
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 items-center justify-items-center">
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="w-full flex items-center justify-center p-4 hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              <img 
                src={client.logo} 
                alt={client.name} 
                className="max-h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-bold text-regenesys-navy/30 text-xs tracking-tight uppercase text-center">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
