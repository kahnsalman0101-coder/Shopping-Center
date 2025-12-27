// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.role === 'admin');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let userData;
        
        // Admin users
        if (email === 'salman@123.com' && password === 'admin123') {
          userData = {
            id: 1,
            email: email,
            name: 'Admin User',
            role: 'admin'
          };
        } 
        // Regular users
        else if (email && password) {
          userData = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            role: 'user'
          };
        } else {
          setIsLoading(false);
          resolve({ success: false, message: 'Invalid credentials' });
          return;
        }
        
        // Store user data
        const token = 'demo-token-' + Date.now();
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
        setIsLoading(false);
        
        resolve({ success: true, user: userData });
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
  };

  const register = (email, password, name) => {
    const userData = {
      id: Date.now(),
      email,
      name: name || email.split('@')[0],
      role: 'user'
    };
    
    const token = 'demo-token-' + Date.now();
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    setUser(userData);
    setIsAdmin(false);
    
    return { success: true, user: userData };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};