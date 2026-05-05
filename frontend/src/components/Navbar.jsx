import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Sparkles, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onEnrollClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, setAiSidebarOpen, logout, aiSidebarOpen } = useAuth();
  
  const isHomePage = location.pathname === '/';
  const darkHeroPages = [
    '/',
    '/contact',
    '/programmes/role-based',
    '/programmes/data-zen-master',
    '/programmes/technology-stack',
    '/programmes/gen-ai-academy',
    '/programmes/freshers-talent-transformation',
    '/programmes/leadership-mastery'
  ];

  const hasDarkHero = darkHeroPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const programmes = [
    { name: "Role Based Programmes", path: "/programmes/role-based" },
    { name: "Data Zen Master Programme", path: "/programmes/data-zen-master" },
    { name: "Technology Stack Programme", path: "/programmes/technology-stack" },
    { name: "Gen AI Academy", path: "/programmes/gen-ai-academy" },
    { name: "Fresher's Talent Transformation Programme", path: "/programmes/freshers-talent-transformation" },
    { name: "Cloud Architect Leadership Programme", path: "/programmes/leadership-mastery" },
    { name: "ESG Programme", path: "/programmes/esg" }
  ];

  const useWhiteText = !isScrolled && hasDarkHero;
  
  return (
    <nav className={`fixed left-0 z-[1000] px-6 lg:px-8 xl:px-12 flex items-center transition-all duration-500 
      ${aiSidebarOpen && user && location.pathname !== '/private-gpt' ? 'right-0 lg:right-[420px]' : 'right-0'}
      ${isScrolled ? 'top-0 h-16 bg-white shadow-premium-lg border-b border-gray-100' : 'top-[var(--topbar-height)] lg:top-[var(--topbar-height-desktop)] h-20 lg:h-20 bg-transparent'}`}>
      
      <Link to="/" className="flex items-center gap-3">
        <div className="relative group">
          <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-lg transition-transform group-hover:rotate-[15deg] duration-700">
            <circle cx="50" cy="50" r="50" fill="url(#logoGrad)" />
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdb913" />
                <stop offset="100%" stopColor="#008444" />
              </linearGradient>
            </defs>
            <path d="M50 20 L35 45 L42 45 L30 70 L45 70 L45 80 L55 80 L55 70 L70 70 L58 45 L65 45 Z" fill="white" />
          </svg>
        </div>
        <div className="leading-none">
          <div className={`text-[18px] lg:text-[22px] font-black uppercase tracking-tight ${useWhiteText ? 'text-white drop-shadow-md' : 'text-regenesys-navy'}`}>Regenesys</div>
          <div className={`text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.25em] ${useWhiteText ? 'text-white/80' : 'text-regenesys-muted'}`}>Corporate Education</div>
        </div>
      </Link>

      <div className="hidden lg:flex lg:ml-8 xl:ml-16 items-center lg:gap-0 xl:gap-1 h-full">
        <NavLink to="/" active={isHomePage} useWhite={useWhiteText}>Home</NavLink>
        <div className="relative group h-full flex items-center" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
          <button className={`lg:px-3 xl:px-5 py-2 rounded-full text-[14px] font-black transition-all flex items-center gap-1.5 ${useWhiteText ? 'text-white hover:text-regenesys-gold drop-shadow-md' : 'text-regenesys-navy/80 hover:text-regenesys-red'}`}>
            Programmes <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`absolute top-[80%] left-0 bg-white border border-gray-100 rounded-2xl shadow-premium-2xl min-w-[300px] py-4 transition-all ${isDropdownOpen ? 'opacity-100 visible translate-y-2' : 'opacity-0 invisible translate-y-0'}`}>
            {programmes.map((prog, idx) => (
              <Link key={idx} to={prog.path} className="block px-6 py-3 text-[13px] font-black text-regenesys-navy hover:bg-gray-50 hover:text-regenesys-red transition-all">{prog.name}</Link>
            ))}
          </div>
        </div>
        <NavLink to="/blogs" active={location.pathname === '/blogs'} useWhite={useWhiteText}>Blogs</NavLink>
        <NavLink to="/events" active={location.pathname === '/events'} useWhite={useWhiteText}>Events</NavLink>
        <NavLink to="/success-stories" active={location.pathname === '/success-stories'} useWhite={useWhiteText}>Success Stories</NavLink>
        <NavLink to="/contact" active={location.pathname === '/contact'} useWhite={useWhiteText}>Contact Us</NavLink>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* AI Assistant Button - Visible for everyone */}
        <button 
          onClick={() => {
            if (user) {
              setAiSidebarOpen(true);
            } else {
              navigate('/login');
            }
          }}
          className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all ${useWhiteText ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20' : 'bg-regenesys-purple/10 text-regenesys-purple hover:bg-regenesys-purple/20'}`} 
          title="Open AI Assistant"
        >
          <Sparkles size={18} />
        </button>

        {user?.email === 'admin@regenesys.com' ? (
          <Link to="/private-gpt" className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all ${useWhiteText ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20' : 'bg-regenesys-purple/10 text-regenesys-purple hover:bg-regenesys-purple/20'}`} title="PrivateGPT">
            <ShieldCheck size={18} />
          </Link>
        ) : !user && (
          <Link to="/login" className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${useWhiteText ? 'text-white hover:text-regenesys-gold' : 'text-regenesys-navy hover:text-regenesys-purple'}`}>
            <LogIn size={14} /> Login
          </Link>
        )}
        
        {user && (
          <button 
            onClick={logout}
            className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all ${useWhiteText ? 'text-white hover:text-regenesys-gold' : 'text-regenesys-navy hover:text-regenesys-red'}`}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        )}
        <button onClick={onEnrollClick} className={`hidden md:block px-6 py-2.5 rounded-full text-[12px] font-black transition-all shadow-premium active:scale-95 ${useWhiteText ? 'bg-white text-regenesys-navy hover:bg-regenesys-gold' : 'bg-regenesys-navy text-white hover:bg-regenesys-red'}`}>GET STARTED</button>
        <button className={`lg:hidden p-2 ${useWhiteText ? 'text-white' : 'text-regenesys-navy'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 bg-regenesys-navy z-[2000] lg:hidden flex flex-col p-8">
            <div className="flex justify-between items-center mb-12">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-regenesys-navy">R</div><div className="text-white font-black text-xl uppercase">Regenesys</div></Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white bg-white/10 p-2 rounded-full"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-8">
              <MobileLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileLink>
              <div className="space-y-4">
                <div className="text-[11px] font-black text-white/40 uppercase tracking-widest pl-1">Programmes</div>
                <div className="flex flex-col gap-4 pl-2">
                  {programmes.map((prog, idx) => (
                    <Link key={idx} to={prog.path} onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 text-lg font-bold">{prog.name}</Link>
                  ))}
                </div>
              </div>
              <MobileLink to="/success-stories" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</MobileLink>
              <MobileLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</MobileLink>
              {user?.email === 'admin@regenesys.com' ? (
                <MobileLink to="/private-gpt" onClick={() => setIsMobileMenuOpen(false)}>PrivateGPT</MobileLink>
              ) : !user && (
                <MobileLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</MobileLink>
              )}
            </div>
            <button onClick={() => { setIsMobileMenuOpen(false); onEnrollClick(); }} className="mt-auto w-full bg-regenesys-gold text-regenesys-navy py-6 rounded-2xl font-black text-xl shadow-premium-xl active:scale-95 transition-transform">GET STARTED NOW</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, children, active, useWhite }) => (
  <Link to={to} className={`lg:px-3 xl:px-5 py-2 rounded-full text-[14px] font-black transition-all relative group ${active ? (useWhite ? 'text-regenesys-gold' : 'text-regenesys-red') : (useWhite ? 'text-white hover:text-regenesys-gold drop-shadow-md' : 'text-regenesys-navy hover:text-regenesys-red')}`}>
    {children}
    {active && <div className={`absolute bottom-1.5 left-5 right-5 h-0.5 rounded-full ${useWhite ? 'bg-regenesys-gold' : 'bg-regenesys-red'}`} />}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => <Link to={to} onClick={onClick} className="text-3xl font-black text-white">{children}</Link>;

export default Navbar;
