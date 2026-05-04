import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SEO from '../components/SEO';

const caseStudies = [
  {
    sector: "Building Leadership Excellence in Manufacturing Sector",
    title: "Leadership Development | programme: Team Building for Leaders",
    description: "A leadership development programme was designed to inspire leadership teams in the manufacturing sector to collaborate more effectively. Through immersive outbound team-building exercises and leadership workshops facilitated by industry experts, over 270 leaders were successfully trained across three batches.",
    metrics: [
      { label: "Batches Delivered", value: "3" },
      { label: "Participants Trained", value: "270" },
      { label: "Facilitators Involved", value: "2" }
    ]
  },
  {
    sector: "Technological Advancement at BFSI Finserv Sector",
    title: "Technology | programmes: FSD–Mobile App, FSD–Java, FSD–Django",
    description: "To equip tech teams in the NBFC sector with the latest software development skills, a partnership was formed to offer intensive Full Stack Development (FSD) training programmes. Delivered by subject matter experts, the FSD–Mobile App and Java courses trained 54 participants in Pune.",
    metrics: [
      { label: "Batches Delivered", value: "3" },
      { label: "Participants Trained", value: "54" },
      { label: "Total Training Hours", value: "510" }
    ]
  },
  {
    sector: "Innovating with Generative AI at CRISIL Sector",
    title: "Analytics and AI | programme: Senior Leadership programme – Generative AI",
    description: "CRISIL, a leading analytical company, sought to upskill their senior leaders in Generative AI technologies. Through our specialised masterclass led by our subject matter expert, 20 leaders participated in an advanced programme designed to explore AI-driven analytics.",
    metrics: [
      { label: "Batches Delivered", value: "1" },
      { label: "Participants Trained", value: "20" },
      { label: "Total Training Hours", value: "40" }
    ]
  },
  {
    sector: "Multilingual Skills Development at PhoenixContact",
    title: "Manufacturing | programme: German Language A1",
    description: "A leading manufacturing company recognised the importance of German language in its international operations. Through a Virtual Instructor-Led Training (VILT) format, German language classes were conducted for 10 participants, improving communication with global partners.",
    metrics: [
      { label: "Batches Delivered", value: "1" },
      { label: "Participants Trained", value: "10" },
      { label: "Facilitators Involved", value: "60" }
    ]
  },
  {
    sector: "Driving Operational Efficiency at Hindalco Sector",
    title: "Operations | programme: Knowledge Series – GenAI for Operations",
    description: "A leading operations company sought to explore how AI could streamline operational processes. Through a focused Virtual Instructor-Led Training (VILT) session, 35 participants gained insights into the practical applications of Generative AI in operations.",
    metrics: [
      { label: "Batches Delivered", value: "1" },
      { label: "Participants Trained", value: "35" },
      { label: "Facilitators Involved", value: "3" }
    ]
  },
  {
    sector: "Empowering Women Leaders at Tata Steel Sector",
    title: "Leadership Development | programme: Women In Leadership",
    description: "Tata Steel collaborated with us to develop a leadership programme that empowers women leaders within the organisation. Through mentoring and leadership sessions, 40 women leaders were trained to enhance their strategic thinking and leadership presence.",
    metrics: [
      { label: "Batches Delivered", value: "1" },
      { label: "Participants Trained", value: "40" },
      { label: "Total Training Hours", value: "45" }
    ]
  }
];

const advancedCases = [
  {
    sector: "Advanced Data Analytics at HDFC Bank Sector",
    title: "Finance | programme: Data Analytics for Decision Making",
    description: "HDFC Bank partnered with us to train 60 mid-level managers in data analytics. This programme helped participants develop data-driven decision-making skills essential for strategic growth.",
    metrics: [
      { label: "Batches Delivered", value: "2" },
      { label: "Participants Trained", value: "60" },
      { label: "Total Training Hours", value: "90" }
    ]
  },
  {
    sector: "AI-Driven Marketing at Reliance Sector",
    title: "Marketing | programme: AI for Digital Marketing",
    description: "Reliance's marketing teams underwent specialised training on AI applications in digital marketing. 25 participants completed the programme, driving enhanced customer engagement strategies.",
    metrics: [
      { label: "Batches Delivered", value: "1" },
      { label: "Participants Trained", value: "25" },
      { label: "Facilitators Involved", value: "30" }
    ]
  }
];

const testimonials = [
  { quote: "A comprehensive German language training programme was successfully delivered to enhance communication skills and career prospects.", company: "Phoenix Contact", stars: 5 },
  { quote: "The IGNITE Inspiring Excellence workshop has been instrumental in empowering women employees by fostering self-awareness, resilience, and problem-solving skills.", company: "Glenmark Hospital", stars: 5 },
  { quote: "The comprehensive Full Stack Development (FSD) training by Regenesys empowered tech teams with cutting-edge skills, enhancing technical expertise.", company: "APAR Industries", stars: 5 },
  { quote: "The Generative AI Masterclass by Regenesys empowered senior stakeholders, positioning them at the forefront of AI adoption in financial analytics.", company: "Bajaj Finserv", stars: 5 },
  { quote: "The Generative AI session by stakeholders provided actionable insights, laying a strong foundation for innovation and automation within operational processes.", company: "CRISIL", stars: 5 },
  { quote: "Regenesys's session on Generative AI provided us with actionable insights, laying the groundwork for innovation and automation within operations.", company: "Hindalco", stars: 5 },
];

const SuccessStories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Success Stories & Case Studies" 
        description="Explore how Regenesys has transformed leadership teams and upskilled technical workforces across diverse industries through real-world case studies."
      />
      <TopBar onEnrollClick={toggleModal} />
      <Navbar onEnrollClick={toggleModal} />

      <main>
        {/* Hero */}
        <section className="pt-24 lg:pt-36 pb-16 lg:pb-24 px-6 lg:px-10 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-head text-[32px] lg:text-[48px] font-bold text-regenesys-navy leading-tight mb-6">
                Our Clients' Success Stories:<br className="hidden md:block" />
                Transforming Leaders and Innovators Across Industries
              </h1>
              <button onClick={toggleModal} className="bg-regenesys-navy text-white px-8 py-3.5 rounded-lg font-bold text-[14px] hover:bg-regenesys-navy-dark transition-all active:scale-95">
                Get Started
              </button>
            </motion.div>
          </div>
        </section>

        {/* Intro Paragraph */}
        <section className="pb-16 lg:pb-20 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-regenesys-muted text-[15px] lg:text-[16px] leading-[1.8]">
              Regenesys Corporate Education believes in empowering organisations and individuals with cutting-edge knowledge and skills that drive performance and innovation. Our impactful training programmes have touched diverse industries, from technology to finance and manufacturing. Our programmes have successfully delivered measurable results across 2000+ participants in various sectors, with over 100+ batches conducted, totalling more than 5000+ hours of transformative learning.
            </p>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-8 lg:py-12 px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {caseStudies.map((study, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-premium-lg transition-all"
                >
                  <div className="text-[10px] font-bold text-regenesys-muted uppercase tracking-[0.15em] mb-3">{study.sector}</div>
                  <h3 className="text-[18px] lg:text-[20px] font-bold text-regenesys-navy mb-4 leading-snug">{study.title}</h3>
                  <p className="text-regenesys-muted text-[13px] leading-[1.7] mb-6">{study.description}</p>
                  <div className="border-t border-gray-100 pt-5">
                    <div className="text-[12px] font-bold text-regenesys-navy mb-3">Key Metrics:</div>
                    <div className="space-y-1.5">
                      {study.metrics.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[13px] text-regenesys-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-regenesys-navy shrink-0" />
                          {m.label}: {m.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Cases — 2 col full width */}
        <section className="py-8 lg:py-12 px-6 lg:px-10 bg-regenesys-off">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {advancedCases.map((study, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 rounded-xl p-8"
                >
                  <div className="text-[10px] font-bold text-regenesys-muted uppercase tracking-[0.15em] mb-3">{study.sector}</div>
                  <h3 className="text-[18px] lg:text-[20px] font-bold text-regenesys-navy mb-4 leading-snug">{study.title}</h3>
                  <p className="text-regenesys-muted text-[13px] leading-[1.7] mb-6">{study.description}</p>
                  <div className="border-t border-gray-100 pt-5">
                    <div className="text-[12px] font-bold text-regenesys-navy mb-3">Key Metrics:</div>
                    <div className="space-y-1.5">
                      {study.metrics.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[13px] text-regenesys-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-regenesys-navy shrink-0" />
                          {m.label}: {m.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statement */}
        <section className="py-16 lg:py-20 px-6 lg:px-10 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-regenesys-muted text-[14px] lg:text-[15px] leading-[1.8]">
              At Regenesys Corporate Education, we take pride in creating customised learning experiences that drive growth and innovation for our clients. Our success is measured by the milestones our clients achieve through our partnership. With over 1000+ participants trained, 100+ batches conducted, and more than 5000+ hours of learning delivered, we are dedicated to fostering transformative growth.
            </p>
          </div>
        </section>

        {/* Testimonials — Successful Deliveries */}
        <section className="py-16 lg:py-24 px-6 lg:px-10 bg-regenesys-off">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-head text-[28px] lg:text-[38px] font-bold text-regenesys-navy text-center mb-16">Successful Deliveries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-premium transition-all"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.stars)].map((_, idx) => (
                      <Star key={idx} size={14} className="text-regenesys-gold fill-regenesys-gold" />
                    ))}
                  </div>
                  <p className="text-regenesys-muted text-[13px] leading-[1.7] mb-5">"{t.quote}"</p>
                  <div className="text-[12px] font-bold text-regenesys-navy">{t.company}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="py-16 lg:py-20 px-6 lg:px-10 bg-regenesys-navy text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="font-head text-[24px] lg:text-[36px] text-white font-bold mb-4">Let's Get In Touch And Have A Discussion</h2>
            <p className="text-white/50 text-[14px] mb-8">Deliver faster, collaborate better and innovate more effectively.</p>
            <button onClick={toggleModal} className="bg-regenesys-purple text-white px-10 py-3.5 rounded-lg font-bold text-[14px] hover:bg-regenesys-purple-dark transition-all active:scale-95">
              Contact Us
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      <PrivateGPT />
    </div>
  );
};

export default SuccessStories;
