import React from 'react';
import { Check, MapPin, Mail, Phone } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-white border-b border-gray-100 py-2.5 px-10 hidden lg:flex items-center justify-between text-[12px] font-medium text-gray-600">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Check size={14} className="text-[#4570c9]" strokeWidth={3} />
          Boost productivity and drive growth with Corporate Education.
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-1.5 hover:text-[#4570c9] transition-colors cursor-pointer">
          <MapPin size={14} className="text-[#4570c9]" />
          The Capital, C-70, G Block, BKC
        </div>
        <div className="flex items-center gap-1.5 hover:text-[#4570c9] transition-colors cursor-pointer">
          <Mail size={14} className="text-[#4570c9]" />
          Regenesys.consulting@regenesys.net
        </div>
        <div className="flex items-center gap-1.5 hover:text-[#4570c9] transition-colors cursor-pointer">
          <Phone size={14} className="text-[#4570c9]" />
          +91 9773456788
        </div>
      </div>
    </div>
  );
};

export default TopBar;
