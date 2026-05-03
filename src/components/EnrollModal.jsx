import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import roleOverview from '../assets/role_overview.png';

const countries = [
  { name: "India", code: "+91", flag: "IN" },
  { name: "United States", code: "+1", flag: "US" },
  { name: "United Kingdom", code: "+44", flag: "UK" },
  { name: "South Africa", code: "+27", flag: "ZA" },
  { name: "UAE", code: "+971", flag: "AE" },
  { name: "Singapore", code: "+65", flag: "SG" },
  { name: "Australia", code: "+61", flag: "AU" },
  { name: "Germany", code: "+49", flag: "DE" }
];

const EnrollModal = ({ isOpen, onClose }) => {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-regenesys-navy/70 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-[880px] w-full relative shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[540px]"
          >
            {/* Left Image Section */}
            <div className="hidden md:block md:w-[42%] relative overflow-hidden bg-regenesys-navy">
              <img 
                src={roleOverview} 
                alt="Representative" 
                className="w-full h-full object-cover object-center opacity-60 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-regenesys-navy via-transparent to-transparent" />
              <div className="absolute bottom-10 left-8 right-8 text-white">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffcc00] to-[#008444] flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg">R</div>
                <h3 className="text-xl font-bold mb-2">Transform Your Workforce</h3>
                <p className="text-[13px] text-white/60 leading-relaxed">Get in touch with our experts for a customised learning solution.</p>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 p-8 lg:p-10 flex flex-col relative">
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X size={16} />
              </button>

              <div className="mb-8">
                <h3 className="text-[22px] font-bold text-regenesys-navy mb-1">Upskill Your Team</h3>
                <p className="text-[13px] text-regenesys-muted">Fill the form below and we'll get back to you within 24 hours.</p>
              </div>
              
              <form className="space-y-3.5 flex-1">
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] outline-none focus:border-regenesys-navy focus:bg-white transition-all placeholder:text-gray-400"
                />
                
                <input 
                  type="email" 
                  placeholder="Work Email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] outline-none focus:border-regenesys-navy focus:bg-white transition-all placeholder:text-gray-400"
                />
                
                <div className="relative">
                  <div className="flex items-center gap-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden focus-within:border-regenesys-navy focus-within:bg-white transition-all">
                    <button 
                      type="button"
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="flex items-center gap-1.5 px-3 py-3 border-r border-gray-200 hover:bg-gray-100 transition-colors text-[13px] font-bold text-regenesys-navy shrink-0"
                    >
                      <span>{selectedCountry.flag}</span>
                      <span className="text-gray-400">{selectedCountry.code}</span>
                      <ChevronDown size={12} className={`text-gray-300 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <input 
                      type="tel" 
                      placeholder="Phone Number"
                      className="flex-1 px-3 py-3 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
                    />
                  </div>

                  {/* Country Dropdown */}
                  <AnimatePresence>
                    {isCountryOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-premium-xl z-50 py-1.5 max-h-[220px] overflow-y-auto"
                      >
                        {countries.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-[13px] ${selectedCountry.code === c.code ? 'bg-regenesys-navy/[0.03]' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[12px] font-bold text-regenesys-navy/60 w-6">{c.flag}</span>
                              <span className="text-gray-700">{c.name}</span>
                            </div>
                            <span className="text-gray-400 text-[12px] font-mono">{c.code}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] outline-none appearance-none focus:border-regenesys-navy focus:bg-white transition-all text-gray-400">
                    <option>Select Programme</option>
                    <option>Role Based Programmes</option>
                    <option>Data Zen Master</option>
                    <option>Technology Stack</option>
                    <option>Gen AI Academy</option>
                    <option>Fresher's Talent Transformation</option>
                    <option>Leadership Mastery Suite</option>
                    <option>ESG Programme</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                </div>

                <input 
                  type="text" 
                  placeholder="Organisation Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] outline-none focus:border-regenesys-navy focus:bg-white transition-all placeholder:text-gray-400"
                />
                
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-regenesys-navy text-white rounded-xl font-bold text-[14px] hover:bg-regenesys-navy-dark hover:shadow-premium-lg transition-all mt-4 active:scale-[0.98]"
                >
                  Talk to Our Experts
                </button>
              </form>

              <p className="text-[10px] text-gray-300 text-center mt-4">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnrollModal;
