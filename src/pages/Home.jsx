import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Clients from '../components/Clients';
import Programmes from '../components/Programmes';
import Lifecycle from '../components/Lifecycle';
import TheoryOfChange from '../components/TheoryOfChange';
import AboutUs from '../components/AboutUs';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import PrivateGPT from '../components/PrivateGPT';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
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
        <Hero onEnrollClick={toggleModal} />
        <Features />
        
        <div className="reveal">
          <Clients />
        </div>
        
        <div className="reveal">
          <Programmes />
        </div>
        
        <div className="reveal">
          <Lifecycle />
        </div>
        
        <div className="reveal">
          <TheoryOfChange />
        </div>
        
        <div className="reveal">
          <AboutUs onEnrollClick={toggleModal} />
        </div>
        
        <CTABand onEnrollClick={toggleModal} />
      </main>

      <Footer />

      <EnrollModal isOpen={isModalOpen} onClose={toggleModal} />
      <PrivateGPT />
    </div>
  );
}

export default Home;
