import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('regenesys_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('regenesys_user');
      }
    }
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('regenesys_users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this would be hashed
      createdAt: new Date().toISOString(),
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };

    users.push(newUser);
    localStorage.setItem('regenesys_users', JSON.stringify(users));

    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar };
    setUser(sessionUser);
    localStorage.setItem('regenesys_user', JSON.stringify(sessionUser));

    return { success: true };
  };

  const login = (email, password) => {
    // Master Access for Testing
    if (email === 'admin@regenesys.com' && password === 'admin123') {
      const adminUser = { id: 'admin', name: 'Admin User', email: 'admin@regenesys.com', avatar: 'AD' };
      setUser(adminUser);
      localStorage.setItem('regenesys_user', JSON.stringify(adminUser));
      return { success: true };
    }

    const users = JSON.parse(localStorage.getItem('regenesys_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const sessionUser = { id: found.id, name: found.name, email: found.email, avatar: found.avatar };
    setUser(sessionUser);
    localStorage.setItem('regenesys_user', JSON.stringify(sessionUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('regenesys_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
