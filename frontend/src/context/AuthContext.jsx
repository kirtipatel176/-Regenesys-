import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// Utility to simulate network delay for realistic mock behavior
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

  // Initialize Auth State from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('regenesys_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (error) {
          console.error("Failed to parse stored user", error);
          localStorage.removeItem('regenesys_user');
        }
      }
      // Small artificial delay for smooth initial load
      await delay(300);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const checkEmail = async (email) => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('regenesys_users') || '[]');
    return !!users.find(u => u.email === email);
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    await delay(1500); // Simulate processing time
    
    const users = JSON.parse(localStorage.getItem('regenesys_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this would be hashed
      role: 'user',
      createdAt: new Date().toISOString(),
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };

    users.push(newUser);
    localStorage.setItem('regenesys_users', JSON.stringify(users));

    const sessionUser = { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      avatar: newUser.avatar,
      role: newUser.role 
    };
    
    setUser(sessionUser);
    localStorage.setItem('regenesys_user', JSON.stringify(sessionUser));
    setIsLoading(false);

    return { success: true };
  };

  const login = async (email, password) => {
    setIsLoading(true);
    await delay(1200);

    // 1. Check Admin Hardcoded Access
    if (email === 'admin@regenesys.com' && password === 'admin123') {
      const adminUser = { id: 'admin', name: 'Admin User', email: 'admin@regenesys.com', avatar: 'AD', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('regenesys_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Check Standard User Hardcoded Access
    if (email === 'user@regenesys.com' && password === 'user1234') {
      const demoUser = { id: 'user-1', name: 'Demo User', email: 'user@regenesys.com', avatar: 'DU', role: 'user' };
      setUser(demoUser);
      localStorage.setItem('regenesys_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return { success: true };
    }

    // 3. Check LocalStorage Users
    const users = JSON.parse(localStorage.getItem('regenesys_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password.' };
    }

    const sessionUser = { 
      id: found.id, 
      name: found.name, 
      email: found.email, 
      avatar: found.avatar,
      role: found.role || 'user'
    };
    
    setUser(sessionUser);
    localStorage.setItem('regenesys_user', JSON.stringify(sessionUser));
    setIsLoading(false);

    return { success: true };
  };

  // Mock OTP Functions — BYPASS ENABLED
  const requestOTP = async (email) => {
    await delay(800);
    console.log(`[MOCK API] OTP requested for ${email}. (Bypass Active)`);
    return { success: true, message: 'OTP sent successfully' };
  };

  const verifyOTP = async (email, otp) => {
    await delay(800);
    // BYPASS: Always return true regardless of the code entered
    console.log(`[MOCK API] Verifying OTP ${otp} for ${email}... Bypassing!`);
    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    await delay(500);
    setUser(null);
    localStorage.removeItem('regenesys_user');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      aiSidebarOpen, 
      setAiSidebarOpen, 
      checkEmail,
      requestOTP,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

