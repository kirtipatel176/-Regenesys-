import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, MessageCircle } from 'lucide-react';
import heroBanner from '../assets/role_hero.png';
import overviewImg from '../assets/role_overview.png';
import managerImg from '../assets/role_manager.png';
import womanImg from '../assets/role_woman.png';
import techImg from '../assets/role_tech.png';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';
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
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[440px] flex items-center overflow-hidden">
          <img src={heroBanner} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-regenesys-navy via-regenesys-navy/40 to-transparent" />
          <div className="relative z-10 px-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <h1 className="font-head text-[44px] font-bold leading-tight mb-2 uppercase">Empowering</h1>
              <h2 className="font-head text-[44px] font-bold leading-tight mb-4">
                <span className="text-white">ROLES, EMPOWERING </span>
                <span className="text-regenesys-gold-light">RESULTS.</span>
              </h2>
              <p className="text-xl font-medium tracking-wide">through Role-Based Programme</p>
            </motion.div>
          </div>
        </section>

        {/* ... (rest of the sections remain same, just ensure indentation is correct) ... */}
        {/* Programme Overview */}
        <section className="py-20 px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <div className="rounded-2xl overflow-hidden shadow-premium-lg">
                <img src={overviewImg} alt="Overview" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="reveal">
              <h2 className="font-head text-[38px] text-regenesys-navy font-bold leading-tight mb-6">Role-Based Programme Overview</h2>
              <p className="text-[15px] text-regenesys-muted leading-relaxed mb-6">
                Our corporate programmes are tailored to meet the professional development needs of employees at all levels in your organisation. These programmes are designed to enhance skills, foster leadership, and drive innovation within the corporate environment. This programme, which incorporates real-world case studies through a hands-on approach, boosts individual performance and competency and drives overall organisational growth and success. Invest in targeted employee development to achieve your strategic goals and maintain a competitive edge in the market.
              </p>
              <div className="space-y-3">
                <div className="text-[14px] font-bold text-regenesys-navy">Key Features:</div>
                {[
                  "Customised learning modules",
                  "Industry-relevant curriculum",
                  "Interactive and practical training",
                  "Professional certification",
                  "Access to expert mentors and industry leaders"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[14px] text-regenesys-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Alternating Sub-Sections */}
        <section className="py-20 px-20 space-y-32">
          <RoleSection 
            tag="First Time Managers"
            title="Overview"
            desc="This programme cultivates strong leadership skills among emerging and potential organisational leaders. It focuses on execution excellence, effectiveness, productivity, assertiveness, people skills, and decision-making abilities."
            img={managerImg}
            modules={["Strategic Leadership", "Effective Communication", "Decision Making and Problem-Solving", "Change Management", "Emotional Intelligence"]}
            highlights={["Real-world case studies", "Leadership simulations", "Mentorship from industry leaders", "Certification upon completion"]}
          />

          <RoleSection 
            tag="Women Leadership"
            title="Overview"
            desc="This programme addresses unique challenges women face in leadership roles, enhancing their ability to lead effectively and drive organisational success. Employees will gain insights into strategic thinking, communication, and emotional intelligence while also benefiting from a supportive network of peers and mentors."
            img={womanImg}
            reversed
            modules={["Strategic Leadership for Women", "Effective Communication", "Emotional Intelligence", "Work-Life Integration", "Mentorship and Networking"]}
            highlights={["Interactive Workshops", "Real-World Case Studies", "Leadership Simulations", "Certification Upon Completion", "Access to Expert Mentors"]}
            tagColor="bg-red-500"
          />

          <RoleSection 
            tag="Role-Based Functional Skills"
            title="Overview"
            desc="This technical skills programme is designed to keep your employees up-to-date with technological advancements. It covers various technical skills essential for today's dynamic work environment."
            img={techImg}
            modules={["Business Finance", "Entrepreneurship", "A/B Testing", "Experimentation", "Digital Transformation Programme", "Key Account Management", "Sales Skills", "Hiring Skills"]}
            highlights={["Role Based Training", "Networking Opportunities", "Expert Led Sessions", "Certification Upon Completion"]}
          />
        </section>

        {/* Why Partner with Us */}
        <section className="py-20 px-20 bg-regenesys-off">
          <h2 className="font-head text-[38px] text-regenesys-navy font-bold text-center mb-16">Why Partner with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PartnerCard icon="📋" text="100% hands-on-training for organisations to learn how to automate tasks" />
            <PartnerCard icon="👥" text="Customised learning specific to the business objectives of your organisation" />
            <PartnerCard icon="🔍" text="Best Case studies from different industries, including the Big Four." />
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-20 px-20">
          <h2 className="font-head text-[38px] text-regenesys-navy font-bold text-center mb-16">Our Approach</h2>
          <div className="flex flex-col lg:flex-row gap-px bg-regenesys-border h-[400px]">
            <div className="flex-[2] bg-blue-600 p-10 flex flex-col justify-end text-white relative">
              <div className="text-[12px] font-mono mb-2">LEARNING</div>
              <p className="text-[13px] opacity-80">To Familiarise the workforce with key concepts and frameworks</p>
            </div>
            {["APPLICATION", "EXPERIENCE", "REINFORCEMENT", "NUDGING"].map((step, i) => (
              <div key={i} className="flex-1 bg-white p-6 flex items-center justify-center relative group hover:bg-regenesys-navy transition-colors">
                <div className="absolute top-6 right-6 text-gray-300 group-hover:text-white transition-colors">↑</div>
                <div className="vertical-text font-bold text-gray-400 group-hover:text-white transition-colors tracking-[4px]">{step}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-20 bg-regenesys-off">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="reveal">
              <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full inline-block mb-4 uppercase tracking-widest">FAQS</div>
              <h2 className="font-head text-[44px] font-bold text-regenesys-navy leading-tight mb-6">Frequently Asked Questions</h2>
              <p className="text-[15px] text-regenesys-muted mb-8">Find answers to commonly asked questions about role-based programme & its impact on employees & employers</p>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-colors">Talk To Us →</button>
                <button className="border border-regenesys-border px-6 py-2.5 rounded-lg text-[13px] font-bold text-regenesys-muted hover:bg-white transition-colors">Contact Us</button>
              </div>
            </div>
            <div className="reveal space-y-4">
              <FAQItem question="What is the Role-Based Programme?" answer="The Role-Based Programme is designed to equip employees with essential Functional skills for today's dynamic work environment." active />
              <FAQItem question="Who should enrol in this programme?" />
              <FAQItem question="What is the structure of the training modules?" />
              <FAQItem question="Do participants from organisations receive any certification upon completion?" />
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-20 px-20 bg-blue-600 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-head text-[34px] font-bold mb-4">Let's Get In Touch And Have A Discussion</h2>
            <p className="opacity-80 mb-10">Deliver faster, collaborate better and innovate more effectively.</p>
            <button className="bg-white text-blue-600 px-10 py-3 rounded-full font-bold text-[14px] hover:bg-blue-50 transition-colors">Contact us →</button>
          </div>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      <PrivateGPT />
    </div>
  );
};

const RoleSection = ({ tag, title, desc, img, reversed, modules, highlights, tagColor = "bg-blue-600" }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
    <div className={`reveal ${reversed ? 'lg:order-2' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-1.5 ${tagColor} rounded-md text-white`}><MessageCircle size={16} /></div>
        <div className={`text-sm font-bold ${tagColor.replace('bg-','text-')}`}>{tag}</div>
      </div>
      <h3 className="font-head text-[28px] text-regenesys-navy font-bold mb-4">{title}</h3>
      <p className="text-[14px] text-regenesys-muted leading-relaxed mb-8">{desc}</p>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-[13px] font-bold text-regenesys-navy mb-3">Modules:</div>
          <ul className="space-y-2">
            {modules.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-regenesys-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[13px] font-bold text-regenesys-navy mb-3">Highlights:</div>
          <ul className="space-y-2">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-regenesys-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    <div className={`reveal ${reversed ? 'lg:order-1' : ''}`}>
      <div className="rounded-2xl overflow-hidden shadow-premium">
        <img src={img} alt={tag} className="w-full h-full object-cover aspect-[4/3]" />
      </div>
    </div>
  </div>
);

const PartnerCard = ({ icon, text }) => (
  <div className="bg-white p-8 rounded-2xl border border-regenesys-border hover:shadow-premium transition-all reveal">
    <div className="text-3xl mb-4">{icon}</div>
    <p className="text-[13px] text-regenesys-muted leading-relaxed font-medium">{text}</p>
  </div>
);

const FAQItem = ({ question, answer, active }) => (
  <div className="bg-white border border-regenesys-border rounded-xl overflow-hidden">
    <div className="px-6 py-4 flex items-center justify-between cursor-pointer group">
      <div className="text-[14px] font-bold text-regenesys-navy group-hover:text-blue-600 transition-colors">{question}</div>
      <div className="text-regenesys-muted">{active ? '-' : '+'}</div>
    </div>
    {active && answer && (
      <div className="px-6 pb-4 text-[13px] text-regenesys-muted leading-relaxed">
        {answer}
      </div>
    )}
  </div>
);

export default RoleBasedProgramme;
