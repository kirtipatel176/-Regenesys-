import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';
import { Mail, Phone, MapPin, Send, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopBar onEnrollClick={toggleModal} />
      <Navbar onEnrollClick={toggleModal} />

      <main>
        {/* Simple White Hero */}
        <section className="pt-32 pb-16 px-10 border-b border-gray-50">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-[13px] text-gray-400 mb-8">
              <a href="/" className="hover:text-regenesys-navy">Home</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Contact Us</span>
            </nav>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[48px] font-bold text-regenesys-navy leading-tight"
            >
              Contact Us
            </motion.h1>
          </div>
        </section>

        <section className="py-20 px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              
              {/* Left Side: Form */}
              <div>
                <h2 className="text-[32px] font-bold text-regenesys-navy mb-4">Get In Touch With Us</h2>
                <p className="text-gray-500 mb-12 max-w-lg leading-relaxed">
                  Fill out the form below for personalised assistance. Get solutions tailored to your requirements.
                </p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      placeholder="Enter Full Name"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#4570c9] outline-none transition-all text-[14px]"
                    />
                    <input 
                      type="email" 
                      placeholder="Enter Email"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#4570c9] outline-none transition-all text-[14px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="tel" 
                      placeholder="Enter Phone Number"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#4570c9] outline-none transition-all text-[14px]"
                    />
                    <input 
                      type="text" 
                      placeholder="Organisation Name"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#4570c9] outline-none transition-all text-[14px]"
                    />
                  </div>

                  <textarea 
                    rows={5}
                    placeholder="Message"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#4570c9] outline-none transition-all text-[14px] resize-none"
                  ></textarea>

                  <button className="bg-[#4570c9] text-white px-10 py-4 rounded-full font-bold text-[14px] hover:bg-regenesys-navy transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                    SEND MESSAGE
                    <Send size={16} />
                  </button>
                </form>
              </div>

              {/* Right Side: Info */}
              <div className="lg:pt-16">
                <div className="space-y-12">
                  <div className="flex gap-6">
                    <div className="shrink-0 text-[#4570c9]">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-bold text-regenesys-navy mb-2">Send an Email:</h4>
                      <div className="space-y-1">
                        <a href="mailto:Business@regenesys.net" className="block text-gray-500 hover:text-[#4570c9] transition-colors">Business@regenesys.net</a>
                        <a href="mailto:Regenesys.consulting@regenesys.net" className="block text-gray-500 hover:text-[#4570c9] transition-colors">Regenesys.consulting@regenesys.net</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="shrink-0 text-[#4570c9]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-bold text-regenesys-navy mb-2">Visit Us:</h4>
                      <p className="text-gray-500 leading-relaxed max-w-sm">
                        2nd Floor, 213 & 214, The Capital, C-70, G Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra, 400051
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="shrink-0 text-[#4570c9]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-bold text-regenesys-navy mb-2">Toll-Free Phone:</h4>
                      <p className="text-gray-500">
                        +91 1800 212 9950
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100">
                  <h3 className="text-xl font-bold text-regenesys-navy mb-4">Start Tracking Your User Analytics To Boost Your Business</h3>
                  <div className="flex gap-4">
                    <button className="bg-regenesys-navy text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-black transition-all">Get Started</button>
                    <button className="text-regenesys-navy px-6 py-2.5 rounded-full text-[13px] font-bold border border-regenesys-navy hover:bg-regenesys-navy hover:text-white transition-all">Pricing & Plans</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Map */}
        <section className="h-[450px] w-full border-t border-gray-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9388147690623!2d72.86241327596568!3d19.06642195227764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8eec0000001%3A0x633534b797430c51!2sThe%20Capital%2C%20BKC!5e0!3m2!1sen!2sin!4v1714672000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      <PrivateGPT />
    </div>
  );
};

export default Contact;
