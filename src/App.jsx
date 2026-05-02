import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoleBasedProgramme from './pages/RoleBasedProgramme';
import Contact from './pages/Contact';
import ESGProgramme from './pages/ESGProgramme';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programmes/role-based" element={<RoleBasedProgramme />} />
        <Route path="/programmes/esg" element={<ESGProgramme />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
