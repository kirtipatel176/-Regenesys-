import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateGPT = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (user) {
      navigate('/private-gpt');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="fixed bottom-7 right-7 z-[9000] flex items-center group">
      <button 
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-white shadow-premium-xl flex items-center justify-center hover:scale-110 transition-all duration-300 border border-gray-100 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-regenesys-purple/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        <Sparkles size={24} className="text-regenesys-purple relative z-10" />
        
        {/* Pulse indicator */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-regenesys-purple rounded-full border-2 border-white">
          <span className="absolute inset-0 bg-regenesys-purple rounded-full animate-ping opacity-40" />
        </span>
      </button>
    </div>
  );
};

export default PrivateGPT;
