import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const features = [
  {
    text: "Upskilling programmes for all job levels, from freshers to leaders"
  },
  {
    text: "Industry-specific content for IT/ITES, BFSI, GCCs, and others"
  },
  {
    text: "Custom training solutions for Data, Tech and Management"
  }
];

const Features = () => {
  return (
    <div className="max-w-7xl mx-auto px-10 relative z-20 -mt-10">
      <div className="bg-white rounded-2xl shadow-premium-lg border border-gray-100 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {features.map((f, i) => (
          <div key={i} className={`py-8 px-10 flex items-center gap-4 group transition-colors hover:bg-gray-50 ${i < features.length - 1 ? 'md:border-r border-gray-100' : ''}`}>
            <div className="shrink-0 text-regenesys-navy/60 group-hover:text-regenesys-navy transition-colors">
              <CheckCircle2 size={28} strokeWidth={1.5} />
            </div>
            <p className="text-[13.5px] font-medium text-regenesys-muted leading-relaxed">
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
