import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onEnrollClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const programmes = [
    "Role Based Programmes",
    "Data Zen Master Programme",
    "Technology Stack Programme",
    "Gen AI Academy",
    "Fresher's Talent Transformation Programme",
    "Cloud Architect Leadership Programme",
    "ESG Programme"
  ];

  return (
    <nav className={`left-0 right-0 z-[1000] px-10 flex items-center transition-all duration-500 
      ${isScrolled 
        ? 'fixed top-0 h-16 bg-black/95 backdrop-blur-md shadow-lg border-b border-white/5' 
        : 'absolute top-[40px] h-24 bg-transparent'}`}>
      
      <Link to="/" className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="h-1/2 bg-[#ffcc00]" />
            <div className="h-1/2 bg-[#008444]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-1/2 h-1/2 border-l-2 border-r-2 border-t-2 border-white rounded-t-full relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white" />
            </div>
          </div>
          <div className="relative z-10 text-white font-bold text-xl drop-shadow-md">R</div>
        </div>
        <div className="leading-tight">
          <div className="text-[16px] font-head font-bold text-white tracking-tight uppercase">Regenesys</div>
          <div className="text-[9px] font-mono text-white/80 font-bold tracking-[0.1em] leading-none uppercase">Corporate Education</div>
        </div>
      </Link>

      <div className="ml-12 flex items-center h-full">
        <Link to="/" className="px-4 h-full flex items-center text-[14px] font-bold text-white hover:text-[#ffcc00] transition-all relative after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[#ffcc00]">Home</Link>
        
        <div 
          className="relative group h-full"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="px-4 h-full text-[14px] font-bold text-white/90 hover:text-white transition-colors flex items-center gap-1">
            Programmes <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`absolute top-full left-0 bg-white border border-gray-100 rounded-xl shadow-premium-lg min-w-[280px] py-3 transition-all duration-300 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
            {programmes.map((prog, idx) => (
              <Link 
                key={idx} 
                to={prog === "Role Based Programmes" ? "/programmes/role-based" : prog === "ESG Programme" ? "/programmes/esg" : "#"} 
                className="block px-6 py-2.5 text-[13px] font-bold text-[#4570c9] hover:bg-gray-50 hover:text-regenesys-navy hover:pl-8 transition-all"
              >
                {prog}
              </Link>
            ))}
          </div>
        </div>

        <a href="#" className="px-4 h-full flex items-center text-[14px] font-bold text-white/90 hover:text-white transition-colors">Blogs</a>
        <a href="#" className="px-4 h-full flex items-center text-[14px] font-bold text-white/90 hover:text-white transition-colors">Events</a>
        <a href="#" className="px-4 h-full flex items-center text-[14px] font-bold text-white/90 hover:text-white transition-colors">Success Stories</a>
        <Link to="/contact" className="px-4 h-full flex items-center text-[14px] font-bold text-white/90 hover:text-white transition-colors">Contact Us</Link>
      </div>

      <button 
        onClick={onEnrollClick}
        className="ml-auto bg-white text-regenesys-navy px-8 py-3 rounded-full text-[13px] font-bold hover:bg-regenesys-red hover:text-white hover:-translate-y-0.5 transition-all shadow-lg"
      >
        GET STARTED
      </button>
    </nav>
  );
};

export default Navbar;
