import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import RoleBasedProgramme from './pages/RoleBasedProgramme';
import Contact from './pages/Contact';
import ESGProgramme from './pages/ESGProgramme';
import SuccessStories from './pages/SuccessStories';
import DataZenMaster from './pages/DataZenMaster';
import TechnologyStack from './pages/TechnologyStack';
import GenAIAcademy from './pages/GenAIAcademy';
import FresherTransformation from './pages/FresherTransformation';
import LeadershipMastery from './pages/LeadershipMastery';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateGPTPage from './pages/PrivateGPTPage';
import Blogs from './pages/Blogs';
import Events from './pages/Events';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Redirect authenticated users away from login/signup
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/private-gpt" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/programmes/role-based" element={<RoleBasedProgramme />} />
      <Route path="/programmes/esg" element={<ESGProgramme />} />
      <Route path="/programmes/data-zen-master" element={<DataZenMaster />} />
      <Route path="/programmes/technology-stack" element={<TechnologyStack />} />
      <Route path="/programmes/gen-ai-academy" element={<GenAIAcademy />} />
      <Route path="/programmes/freshers-talent-transformation" element={<FresherTransformation />} />
      <Route path="/programmes/leadership-mastery" element={<LeadershipMastery />} />
      <Route path="/success-stories" element={<SuccessStories />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/events" element={<Events />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/private-gpt" element={<ProtectedRoute><PrivateGPTPage /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
