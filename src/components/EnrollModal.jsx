import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import roleOverview from '../assets/role_overview.png';

const countries = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Åland Islands", code: "+358", flag: "🇦🇽" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" }
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl max-w-[900px] w-full relative shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[560px]"
          >
            {/* Left Image Section */}
            <div className="hidden md:block md:w-[45%] relative overflow-hidden bg-gray-100">
              <img 
                src={roleOverview} 
                alt="Representative" 
                className="w-full h-full object-cover object-center scale-110"
              />
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-lg">
                  <div className="h-1/2 bg-[#ffcc00]" />
                  <div className="h-1/2 bg-[#008444]" />
                </div>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 p-10 flex flex-col relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-[20px] font-bold text-gray-800">Upskill Your Team with Us</h3>
              </div>
              
              <form className="space-y-4 flex-1">
                <input 
                  type="text" 
                  placeholder="Enter Full Name"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#4570c9] transition-all placeholder:text-gray-400"
                />
                
                <input 
                  type="email" 
                  placeholder="Enter Email"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#4570c9] transition-all placeholder:text-gray-400"
                />
                
                <div className="relative">
                  <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#4570c9] transition-all">
                    <button 
                      type="button"
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="flex items-center gap-1.5 px-4 py-3.5 border-r border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg leading-none">{selectedCountry.flag}</span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <input 
                      type="tel" 
                      placeholder="Enter Phone Number"
                      className="flex-1 px-4 py-3.5 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
                    />
                  </div>

                  {/* Country Dropdown */}
                  <AnimatePresence>
                    {isCountryOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 max-h-[240px] overflow-y-auto"
                      >
                        {countries.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryOpen(false);
                            }}
                            className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-[14px]"
                          >
                            <div className="flex items-center gap-3">
                              <span>{c.flag}</span>
                              <span className="text-gray-700">{c.name}</span>
                            </div>
                            <span className="text-gray-400 font-medium">{c.code}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <select className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none appearance-none focus:border-[#4570c9] transition-all text-gray-500">
                    <option>Training For</option>
                    <option>Technical Stack Programmes</option>
                    <option>Leadership</option>
                    <option>Gen AI Academy</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <input 
                  type="text" 
                  placeholder="Organisation Name"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#4570c9] transition-all placeholder:text-gray-400"
                />

                <input 
                  type="text" 
                  placeholder="Destination"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#4570c9] transition-all placeholder:text-gray-400"
                />
                
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-xl font-bold text-[15px] hover:shadow-lg hover:-translate-y-0.5 transition-all mt-6"
                >
                  Talk to Us
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnrollModal;
