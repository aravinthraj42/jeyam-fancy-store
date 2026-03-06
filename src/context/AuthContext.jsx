'use client';

import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Auth Context for managing authentication state
 * 
 * SECURITY NOTE: This is a frontend-only demo admin system.
 * No real encryption is used. Passwords are stored in plain text.
 * This is NOT suitable for production use.
 */
const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'jeyamFancyStoreAuth';

// Admin credentials (should be moved to environment variables in production)
const ADMIN_ACCOUNTS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    displayName: 'Admin',
  },
  {
    id: '2',
    username: 'jeyamfancystore2021',
    password: 'Password@01',
    displayName: 'Edilson',
  },
  {
    id: '3',
    username: 'aravinthraj42',
    password: 'Password@02',
    displayName: 'Super Admin',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading auth from localStorage:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login function
   * Validates username and password
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Object} { success: boolean, error?: string, user?: Object }
   */
  const login = (username, password) => {
    // Find matching admin account
    const admin = ADMIN_ACCOUNTS.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (admin) {
      const userData = {
        id: admin.id,
        username: admin.username,
        displayName: admin.displayName,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid username or password' };
  };

  /**
   * Logout function
   * Clears user from state and localStorage
   */
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

