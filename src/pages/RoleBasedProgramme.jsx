import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Target, Lightbulb, Trophy } from 'lucide-react';
import heroBanner from '../assets/role_hero.png';
import overviewImg from '../assets/role_overview.png';
import managerImg from '../assets/role_manager.png';
import womanImg from '../assets/role_woman.png';
import techImg from '../assets/role_tech.png';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import { useState } from 'react';

const RoleBasedProgramme = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopBar onEnrollClick={toggleModal} />
      <Navbar onEnrollClick={toggleModal} />
      
      <main className="pt-20 lg:pt-0">
        {/* Hero Section - Refined Premium Style */}
        <section className="relative min-h-[400px] lg:h-[600px] flex items-center overflow-hidden bg-regenesys-navy">
          <img src={heroBanner} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-regenesys-navy via-regenesys-navy/60 to-transparent" />
          
          <div className="relative z-10 px-6 lg:px-24 max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-12 bg-regenesys-gold" />
                <span className="text-regenesys-gold font-bold text-[12px] uppercase tracking-[0.3em]">Corporate Excellence</span>
              </div>
              <h1 className="font-head text-[36px] lg:text-[72px] font-bold leading-[1.1] mb-6">
                Empowering <span className="text-regenesys-gold-light italic">Roles.</span><br/>
                Empowering Results.
              </h1>
              <p className="text-[16px] lg:text-[20px] font-medium text-white/80 max-w-xl leading-relaxed mb-10">
                A groundbreaking corporate education initiative designed to bridge the gap between academic knowledge and industrial expertise.
              </p>
              <button 
                onClick={toggleModal}
                className="bg-white text-regenesys-navy px-10 py-4 rounded-full font-bold text-[14px] hover:bg-regenesys-red hover:text-white transition-all shadow-2xl active:scale-95"
              >
                ENROL NOW
              </button>
            </motion.div>
          </div>
        </section>

        {/* Programme Overview - Better Balance */}
        <section className="py-24 lg:py-32 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="reveal">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-regenesys-gold/10 rounded-full -z-10" />
                  <div className="rounded-3xl overflow-hidden shadow-premium-2xl">
                    <img src={overviewImg} alt="Overview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="reveal">
                <h2 className="font-head text-[32px] lg:text-[44px] text-regenesys-navy font-bold leading-tight mb-8">Role-Based Programme Overview</h2>
                <p className="text-[15px] lg:text-[16px] text-regenesys-muted leading-relaxed mb-8">
                  Our programmes are tailored to meet the professional development needs of employees at all levels. We focus on fostering leadership and driving innovation through real-world case studies and a hands-on approach.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {[
                    "Customised learning modules",
                    "Industry-relevant curriculum",
                    "Interactive training",
                    "Expert Mentorship"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#f0f9f4] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#008444]" />
                      </div>
                      <span className="text-[14px] font-bold text-regenesys-navy/80">{f}</span>
                    </div>
                  ))}
                </div>
                <button className="text-regenesys-navy font-bold text-[15px] border-b-2 border-regenesys-gold pb-1 hover:text-regenesys-red hover:border-regenesys-red transition-all">Explore Modules</button>
              </div>
            </div>
          </div>
        </section>

        {/* Role Sections - Modern Alternating Layout */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-[#fafafa] space-y-32">
          <RoleSection 
            tag="First Time Managers"
            title="Emerging Leaders Programme"
            desc="Cultivate strong leadership skills among emerging leaders. Focus on execution excellence, effectiveness, and people management."
            img={managerImg}
            modules={["Strategic Leadership", "Effective Communication", "Decision Making", "Change Management"]}
            highlights={["Case Studies", "Simulations", "Mentorship"]}
          />

          <RoleSection 
            tag="Women Leadership"
            title="Breaking the Glass Ceiling"
            desc="Addressing unique challenges women face in leadership roles, enhancing their ability to lead effectively and drive success."
            img={womanImg}
            reversed
            modules={["Strategic Thinking", "Emotional Intelligence", "Work-Life Integration"]}
            highlights={["Supportive Network", "Peer Learning", "Expert Mentors"]}
            tagColor="bg-regenesys-red"
          />

          <RoleSection 
            tag="Functional Skills"
            title="Technical Excellence"
            desc="Keep your employees up-to-date with technological advancements and essential technical skills for the modern workplace."
            img={techImg}
            modules={["Business Finance", "Digital Transformation", "Sales Skills", "Hiring Skills"]}
            highlights={["Expert Led Sessions", "Certification", "Networking"]}
          />
        </section>

        {/* Why Partner with Us - Icon Grid */}
        <section className="py-24 lg:py-32 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-head text-[32px] lg:text-[44px] text-regenesys-navy font-bold text-center mb-20">Why Partner with Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <PartnerCard icon={Target} title="100% Hands-on" text="Real-world training focused on task automation and practical results." />
              <PartnerCard icon={Lightbulb} title="Customised Learning" text="Bespoke curriculum specific to your business objectives and goals." />
              <PartnerCard icon={Trophy} title="Top Tier Cases" text="Learning from Big Four case studies and global industry leaders." />
            </div>
          </div>
        </section>

        {/* Our Theory of Change - Official Methodology */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-regenesys-navy text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="font-head text-[32px] lg:text-[44px] font-bold text-center mb-6">Our Theory of Change</h2>
            <p className="text-center text-white/60 mb-20 max-w-2xl mx-auto">Innovative teaching methods that set industry standards foster exceptional engagement and create tangible real-world impact.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { phase: "01", title: "LEARNING", desc: "To get familiar with key concepts and frameworks." },
                { phase: "02", title: "APPLICATION", desc: "To consistently practise and track growth with rituals and actions." },
                { phase: "03", title: "EXPERIENCE", desc: "To deeply engage through memorable tools and immersions." },
                { phase: "04", title: "COACHING", desc: "To personalise growth with individual plans and support." },
                { phase: "05", title: "REINFORCEMENT", desc: "To ensure learning sticks through post-program boosters." }
              ].map((step, i) => (
                <div key={i} className={`p-8 rounded-2xl flex flex-col justify-between border h-[320px] transition-all group cursor-default ${i === 0 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <div className={`text-[10px] font-mono font-bold tracking-[0.2em] uppercase ${i === 0 ? 'text-regenesys-gold' : 'text-white/30'}`}>Phase {step.phase}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-4 group-hover:text-regenesys-gold transition-colors">{step.title}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - Clean Design */}
        <section className="py-24 lg:py-32 px-6 lg:px-24 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[11px] font-bold text-regenesys-red uppercase tracking-widest bg-regenesys-red/5 px-4 py-2 rounded-full">Support Center</span>
              <h2 className="font-head text-[32px] lg:text-[44px] text-regenesys-navy font-bold mt-6 mb-4">Frequently Asked Questions</h2>
              <p className="text-regenesys-muted">Everything you need to know about our programmes and impact.</p>
            </div>
            <div className="space-y-4">
              <FAQItem question="What is the Role-Based Programme?" answer="The Role-Based Programme is designed to equip employees with essential Functional skills for today's dynamic work environment." active />
              <FAQItem question="Who should enrol in this programme?" />
              <FAQItem question="What is the structure of the training modules?" />
              <FAQItem question="Do participants receive any certification?" />
            </div>
          </div>
        </section>

        {/* CTA Banner - High Contrast */}
        <section className="py-20 lg:py-32 px-6 lg:px-24 bg-regenesys-red text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)' , backgroundSize: '100px 100px' }} />
          <div className="relative z-10">
            <h2 className="font-head text-[28px] lg:text-[48px] font-bold mb-6">Ready to Transform Your Team?</h2>
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">Let's discuss how we can tailor our programmes to your specific organisational needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={toggleModal}
                className="bg-white text-regenesys-red px-12 py-4 rounded-full font-bold text-[15px] hover:bg-regenesys-navy hover:text-white transition-all shadow-2xl"
              >
                Contact Us Now
              </button>
              <button className="bg-transparent border-2 border-white px-12 py-4 rounded-full font-bold text-[15px] hover:bg-white hover:text-regenesys-red transition-all">
                Talk To Experts
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      
    </div>
  );
};

const RoleSection = ({ tag, title, desc, img, reversed, modules, highlights, tagColor = "bg-blue-600" }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
    <div className={`reveal ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 ${tagColor} rounded-lg text-white flex items-center justify-center shadow-lg`}><MessageCircle size={16} /></div>
        <div className={`text-[12px] font-black uppercase tracking-widest ${tagColor.replace('bg-','text-')}`}>{tag}</div>
      </div>
      <h3 className="font-head text-[32px] lg:text-[40px] text-regenesys-navy font-bold leading-tight mb-6">{title}</h3>
      <p className="text-[15px] lg:text-[16px] text-regenesys-muted leading-relaxed mb-10">{desc}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 border-t border-gray-100 pt-10">
        <div>
          <div className="text-[13px] font-black text-regenesys-navy uppercase tracking-widest mb-4">Core Modules</div>
          <ul className="space-y-3">
            {modules.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] text-regenesys-muted font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-regenesys-gold mt-1.5 shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[13px] font-black text-regenesys-navy uppercase tracking-widest mb-4">Impact Points</div>
          <ul className="space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] text-regenesys-muted font-medium">
                <Check size={14} className="text-[#008444] mt-1 shrink-0" strokeWidth={3} />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    <div className={`reveal ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
      <div className="relative group">
        <div className={`absolute inset-0 ${tagColor} opacity-10 rounded-[40px] translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2`} />
        <div className="rounded-[40px] overflow-hidden shadow-premium-2xl relative aspect-[4/3]">
          <img src={img} alt={tag} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
        </div>
      </div>
    </div>
  </div>
);

const PartnerCard = ({ icon: Icon, title, text }) => (
  <div className="bg-white p-10 rounded-3xl border border-gray-100 hover:border-regenesys-gold hover:shadow-premium-xl transition-all duration-500 reveal group">
    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-regenesys-gold transition-all duration-500">
      <Icon size={32} className="text-regenesys-navy group-hover:text-white transition-colors" />
    </div>
    <h4 className="text-xl font-bold text-regenesys-navy mb-4">{title}</h4>
    <p className="text-[14px] text-regenesys-muted leading-relaxed font-medium">{text}</p>
  </div>
);

const FAQItem = ({ question, answer, active }) => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="px-8 py-6 flex items-center justify-between cursor-pointer group">
      <div className="text-[15px] lg:text-[16px] font-bold text-regenesys-navy group-hover:text-regenesys-red transition-colors">{question}</div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-regenesys-red text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
        {active ? '-' : '+'}
      </div>
    </div>
    {active && answer && (
      <div className="px-8 pb-6 text-[14px] lg:text-[15px] text-regenesys-muted leading-relaxed border-t border-gray-50 pt-4">
        {answer}
      </div>
    )}
  </div>
);

export default RoleBasedProgramme;
