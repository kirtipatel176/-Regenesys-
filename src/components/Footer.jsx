import React from 'react';
import { Globe, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-regenesys-navy text-white pt-20 pb-10 px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full overflow-hidden border border-white/10">
                  <div className="h-1/2 bg-[#ffcc00]" />
                  <div className="h-1/2 bg-[#008444]" />
                </div>
                <div className="relative z-10 text-white font-bold text-lg drop-shadow-sm">R</div>
              </div>
              <div>
                <div className="text-[14px] font-head font-bold tracking-tight uppercase">REGENESYS</div>
                <div className="text-[7px] font-mono text-white/80 font-bold tracking-[0.12em] leading-none uppercase">CORPORATE EDUCATION</div>
              </div>
            </div>
            <p className="text-[13px] text-white/60 leading-relaxed mb-8">
              Empowering individuals and organisations through world-class corporate education and strategic transformation programmes.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-regenesys-red transition-all">
                  <Globe size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[15px] font-bold mb-8 uppercase tracking-widest text-regenesys-red">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Programmes", "Success Stories", "Blogs", "Events"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
              <li>
                <a href="/contact" className="text-[13px] text-white/60 hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[15px] font-bold mb-8 uppercase tracking-widest text-regenesys-red">Programmes</h4>
            <ul className="space-y-4">
              {["Role Based Programmes", "Data Zen Master", "Technology Stack", "Gen AI Academy", "Leadership Mastery"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[15px] font-bold mb-8 uppercase tracking-widest text-regenesys-red">Contact</h4>
            <div className="space-y-4 text-[13px] text-white/60">
              <div className="flex gap-2"><MapPin size={14} className="shrink-0 text-regenesys-red" /> <span>The Capital, C-70, G Block, BKC, Mumbai 400051</span></div>
              <div className="flex gap-2"><Mail size={14} className="shrink-0 text-regenesys-red" /> <span>Regenesys.consulting@regenesys.net</span></div>
              <div className="flex gap-2"><Phone size={14} className="shrink-0 text-regenesys-red" /> <span>+91 9773456788</span></div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[12px] text-white/40">
            Copyright © 1998–2024 Regenesys (Pvt) Ltd.
          </div>
          <div className="flex gap-8 text-[12px] text-white/40">
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToTop}
        className="absolute right-10 bottom-10 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-regenesys-red transition-all group"
      >
        <ArrowUp size={18} className="text-white/40 group-hover:text-white" />
      </button>
    </footer>
  );
};

export default Footer;
