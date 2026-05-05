import { Mail, Phone, ChevronRight } from 'lucide-react';

const TopBar = ({ onEnrollClick }) => {
  return (
    <div className="bg-regenesys-navy text-white h-[var(--topbar-height)] lg:h-[var(--topbar-height-desktop)] px-4 lg:px-6 xl:px-10 flex flex-row justify-between items-center lg:gap-4 xl:gap-6 relative z-[100] border-b border-white/5">
      <div className="flex items-center lg:gap-4 xl:gap-6">
        <div className="hidden lg:flex items-center gap-2">
          <span className="w-2 h-2 bg-regenesys-red rounded-full animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">
            Boost productivity and drive growth with Corporate Education.
          </p>
        </div>
        <div className="flex items-center lg:gap-3 xl:gap-4">
          <a href="mailto:Regenesys.consulting@regenesys.net" className="flex items-center gap-2 text-[11px] font-bold hover:text-regenesys-gold transition-colors group">
            <Mail size={12} className="text-regenesys-gold group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Regenesys.consulting@regenesys.net</span>
          </a>
          <a href="tel:+919773456788" className="flex items-center gap-2 text-[11px] font-bold hover:text-regenesys-gold transition-colors group">
            <Phone size={12} className="text-regenesys-gold group-hover:scale-110 transition-transform" />
            <span>+91 9773456788</span>
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onEnrollClick}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 sm:px-4 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 sm:gap-1.5 border border-white/10"
        >
          <span className="hidden sm:inline">REQUEST A </span>CALL BACK <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
