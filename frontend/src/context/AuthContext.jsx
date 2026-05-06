import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

  // Initialize Auth State from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('regenesys_user');
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user", error);
          localStorage.removeItem('regenesys_user');
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const checkEmail = async (email) => {
    // Backend doesn't have a check-email route directly in auth, 
    // we'll just return false here so signup continues.
    return false;
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    try {
      // The backend expects an email and password
      const response = await api.post('/auth/register', { email, password });
      setIsLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed.' 
      };
    }
  };

  const requestOTP = async (email) => {
    try {
      await api.post('/auth/resend-otp', { email });
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to resend OTP' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      await api.post('/auth/verify-otp', { email, otp });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Invalid OTP' };
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // OAuth2PasswordRequestForm expects form data
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);

      // Create a user object since the login endpoint only returns tokens
      // Admin bypass based on email for UI logic
      const role = email === 'admin@regenesys.com' ? 'admin' : 'user';
      const sessionUser = { 
        id: email, 
        name: email.split('@')[0], 
        email: email, 
        avatar: email[0].toUpperCase(),
        role: role 
      };
      
      setUser(sessionUser);
      localStorage.setItem('regenesys_user', JSON.stringify(sessionUser));
      setIsLoading(false);
      return { success: true };

    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Invalid email or password.' 
      };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Optional: Hit logout endpoint on backend if refresh token was stored
      // await api.post('/auth/logout', { refresh_token: '...' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    localStorage.removeItem('regenesys_user');
    localStorage.removeItem('access_token');
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

