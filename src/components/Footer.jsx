import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

const SocialIcon = ({ type }) => {
  const icons = {
    linkedin: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />,
    twitter: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
    youtube: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></>
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[type]}</svg>
  );
};

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/" },
    { name: "Programmes", path: "/programmes/role-based" },
    { name: "Success Stories", path: "/success-stories" },
    { name: "Contact Us", path: "/contact" }
  ];

  const programmeLinks = [
    { name: "Role Based Programmes", path: "/programmes/role-based" },
    { name: "Data Zen Master", path: "/programmes/data-zen-master" },
    { name: "Technology Stack", path: "/programmes/technology-stack" },
    { name: "Gen AI Academy", path: "/programmes/gen-ai-academy" },
    { name: "Fresher's Transformation", path: "/programmes/freshers-talent-transformation" },
    { name: "Leadership Mastery", path: "/programmes/leadership-mastery" },
    { name: "ESG Programme", path: "/programmes/esg" }
  ];

  const socialIcons = ["linkedin", "twitter", "facebook", "instagram", "youtube"];

  return (
    <footer className="bg-regenesys-navy text-white relative overflow-hidden">
      {/* Decorative top line */}
      <div className="h-1 w-full bg-gradient-to-r from-regenesys-red via-regenesys-gold to-regenesys-green" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffcc00] to-[#008444] flex items-center justify-center text-white font-black text-lg shadow-lg">R</div>
              <div className="leading-none">
                <div className="text-[15px] font-head font-bold tracking-tight uppercase">Regenesys</div>
                <div className="text-[8px] font-mono text-white/50 font-bold tracking-[0.15em] uppercase">Corporate Education</div>
              </div>
            </div>
            <p className="text-[13px] text-white/50 leading-[1.8] mb-8 max-w-[280px]">
              Empowering individuals and organisations through world-class corporate education and strategic transformation programmes.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((type, i) => (
                <a key={i} href="#" aria-label={type} className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-regenesys-gold hover:border-regenesys-gold hover:text-regenesys-navy transition-all duration-300 group">
                  <span className="text-white/40 group-hover:text-regenesys-navy">
                    <SocialIcon type={type} />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] font-bold mb-6 uppercase tracking-[0.2em] text-white/30">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-[13px] text-white/60 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="text-[12px] font-bold mb-6 uppercase tracking-[0.2em] text-white/30">Programmes</h4>
            <ul className="space-y-3">
              {programmeLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-[13px] text-white/60 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[12px] font-bold mb-6 uppercase tracking-[0.2em] text-white/30">Contact</h4>
            <div className="space-y-5">
              <div className="flex gap-3 items-start">
                <MapPin size={16} className="shrink-0 text-white/30 mt-0.5" />
                <span className="text-[13px] text-white/60 leading-relaxed">The Capital, C-70, G Block, BKC, Mumbai 400051</span>
              </div>
              <div className="flex gap-3 items-start">
                <Mail size={16} className="shrink-0 text-white/30 mt-0.5" />
                <a href="mailto:Regenesys.consulting@regenesys.net" className="text-[13px] text-white/60 hover:text-white transition-colors break-all">Regenesys.consulting@regenesys.net</a>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={16} className="shrink-0 text-white/30" />
                <a href="tel:+919773456788" className="text-[13px] text-white/60 hover:text-white transition-colors">+91 9773456788</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-white/30">
            Copyright © 1998–2024 Regenesys (Pvt) Ltd. All rights reserved.
          </div>
          <div className="flex gap-8 text-[11px] text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button 
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="hidden lg:flex absolute right-8 bottom-8 w-11 h-11 bg-white/[0.04] border border-white/[0.08] rounded-full items-center justify-center hover:bg-regenesys-gold hover:border-regenesys-gold transition-all duration-300 group"
      >
        <ArrowUp size={18} className="text-white/30 group-hover:text-regenesys-navy" />
      </button>
    </footer>
  );
};

export default Footer;
