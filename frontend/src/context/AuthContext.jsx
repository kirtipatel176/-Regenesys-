import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('regenesys_token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/profile/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const profile = await response.json();
            setUser({
              id: profile.id,
              name: profile.full_name || profile.email?.split('@')[0] || 'User',
              email: profile.email,
              avatar: profile.avatar_url || (profile.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')
            });
          } else {
            // Token expired or invalid
            localStorage.removeItem('regenesys_token');
            localStorage.removeItem('regenesys_refresh_token');
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const checkEmail = async (email) => {
    // Note: Backend might need a dedicated check-email endpoint for better UX
    // For now, we simulate success or use register's logic
    return false; 
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.detail || 'Signup failed' };
      }

      // If signup successful, we can optionally create the profile immediately
      // or just log them in
      return await login(email, password);
    } catch (error) {
      return { success: false, error: 'Could not connect to authentication server.' };
    }
  };

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.detail || 'Invalid email or password.' };
      }

      localStorage.setItem('regenesys_token', data.access_token);
      localStorage.setItem('regenesys_refresh_token', data.refresh_token);

      // Fetch profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      
      const profile = await profileResponse.json();
      const sessionUser = {
        id: profile.id,
        name: profile.full_name || email.split('@')[0],
        email: email,
        avatar: profile.avatar_url || (profile.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')
      };

      setUser(sessionUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Connection error. Please try again later.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('regenesys_token');
    localStorage.removeItem('regenesys_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, aiSidebarOpen, setAiSidebarOpen, checkEmail, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
