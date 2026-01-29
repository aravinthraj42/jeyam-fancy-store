import { createContext, useContext, useState, useEffect } from 'react';
import authData from '../data/auth.json';

/**
 * Auth Context for managing authentication state
 * 
 * SECURITY NOTE: This is a frontend-only demo admin system.
 * No real encryption is used. Passwords are stored in plain text in auth.json.
 * This is NOT suitable for production use.
 */
const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'jeyamFancyStoreAuth';

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
   * Validates username and password against auth.json
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Object} { success: boolean, error?: string, user?: Object }
   */
  const login = (username, password) => {
    // Find user in auth.json
    const foundUser = authData.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      // Create user object without password
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        displayName: foundUser.displayName,
      };

      // Save to localStorage
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

