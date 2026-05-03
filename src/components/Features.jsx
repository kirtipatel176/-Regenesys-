import React from 'react';
import { GraduationCap, Globe, Lightbulb } from 'lucide-react';

const features = [
  { icon: GraduationCap, title: "Upskilling programmes for all job levels, from freshers to leaders." },
  { icon: Globe, title: "Industry-specific content for IT/ITES, BPO, GCCs, and others." },
  { icon: Lightbulb, title: "Custom training solutions for Data, Tech and Management." }
];

const Features = () => {
  return (
    <section className="py-10 lg:py-14 px-6 lg:px-10 bg-white relative -mt-16 lg:-mt-20 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 lg:p-8 rounded-xl shadow-premium-lg border border-gray-50 flex items-start gap-4 hover:shadow-premium-xl transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-lg bg-regenesys-purple/10 flex items-center justify-center shrink-0">
                <f.icon size={20} className="text-regenesys-purple" />
              </div>
              <p className="text-[13px] lg:text-[14px] text-regenesys-muted leading-relaxed">{f.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
