import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import { Mail, MapPin } from 'lucide-react';
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
        {/* Dark Hero — matches reference */}
        <section className="pt-24 lg:pt-32 pb-14 lg:pb-20 px-6 lg:px-10 bg-regenesys-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0c1445] to-transparent" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-block bg-[#6366f1] text-white text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-6">
                We're Here To Help You Succeed!
              </div>
              <h1 className="font-head text-[28px] lg:text-[42px] font-bold text-white leading-tight">
                The Distance Between Dreams And Reality Is Action!
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Form Section — centered layout matching reference */}
        <section className="py-16 lg:py-24 px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-head text-[28px] lg:text-[38px] font-bold text-regenesys-navy mb-4">Get In Touch With Us</h2>
            <p className="text-regenesys-muted text-[15px] leading-relaxed">
              Fill out the form below for personalised assistance. Get solutions tailored to your requirements.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form className="space-y-5">
              <div>
                <label className="text-[13px] font-bold text-regenesys-navy mb-1.5 block">Full Name <span className="text-regenesys-red text-[11px]">(Required)</span></label>
                <input 
                  type="text" 
                  placeholder="Enter Your Name"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-regenesys-navy transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-bold text-regenesys-navy mb-1.5 block">Email <span className="text-regenesys-red text-[11px]">(Required)</span></label>
                  <input 
                    type="email" 
                    placeholder="Enter Your Email"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-regenesys-navy transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-regenesys-navy mb-1.5 block">Phone <span className="text-regenesys-red text-[11px]">(Required)</span></label>
                  <input 
                    type="tel" 
                    placeholder="Enter Your Number"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-regenesys-navy transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-bold text-regenesys-navy mb-1.5 block">Tell us a bit about your query</label>
                <textarea 
                  rows={7}
                  placeholder="Enter Your Message"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-regenesys-navy transition-all resize-none placeholder:text-gray-400"
                ></textarea>
              </div>

              <button className="w-full py-3.5 bg-[#6366f1] text-white rounded-lg font-bold text-[14px] hover:bg-[#4f46e5] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Support Info Section — matching reference cards */}
        <section className="py-16 lg:py-24 px-6 lg:px-10 bg-white">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <div className="text-[11px] font-bold text-[#6366f1] uppercase tracking-[0.25em] mb-3">Need Support</div>
            <h2 className="font-head text-[28px] lg:text-[38px] font-bold text-regenesys-navy mb-4">Contact Us</h2>
            <p className="text-regenesys-muted text-[15px] leading-relaxed max-w-xl mx-auto">
              Contact us for any inquiries or support you may need. Our dedicated team is ready to assist you and provide the best solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Email Card */}
            <div className="bg-[#f8f9fc] rounded-2xl p-8 lg:p-10">
              <div className="w-12 h-12 rounded-full bg-[#6366f1] flex items-center justify-center mb-6">
                <Mail size={20} className="text-white" />
              </div>
              <h4 className="text-[16px] font-bold text-regenesys-navy mb-3">Send an Email:</h4>
              <a href="mailto:Regenesys.consulting@regenesys.net" className="text-[#6366f1] text-[14px] hover:underline">Regenesys.consulting@regenesys.net</a>
            </div>

            {/* Visit Card */}
            <div className="bg-[#f8f9fc] rounded-2xl p-8 lg:p-10">
              <div className="w-12 h-12 rounded-full bg-[#6366f1] flex items-center justify-center mb-6">
                <MapPin size={20} className="text-white" />
              </div>
              <h4 className="text-[16px] font-bold text-regenesys-navy mb-3">Visit Us:</h4>
              <p className="text-regenesys-muted text-[14px] leading-relaxed">
                2nd Floor, 213 & 214, The Capital, C-70, G Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra, 400051
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      
    </div>
  );
};

export default Contact;
