import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'USER' | 'ADMIN') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && 'id' in parsedUser && 'email' in parsedUser && 'role' in parsedUser) {
          setToken(storedToken);
          setUser(parsedUser as User);
        } else {
          console.error('Invalid user data in localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    console.log('Sending login request with:', { email, password });
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);

      const { token, user: userData } = response.data;

      // Validate user data from backend
      if (!userData || !userData.id || !userData.email || !userData.role) {
        throw new Error('Invalid user data from server');
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        role: userData.role === 'ADMIN' ? 'ADMIN' : 'USER', // Ensure role is either 'ADMIN' or 'USER'
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, role: 'USER' | 'ADMIN') => {
    if (!email || !password || !role) {
      throw new Error('Email, password, and role are required');
    }
    console.log('Sending signup request with:', { email, password, role });
    try {
      const response = await api.post('/auth/signup', { email, password, role });
      console.log('Signup response:', response.data);
      const { userId } = response.data;

      // Attempt login after signup
      const loginResponse = await api.post('/auth/login', { email, password });
      console.log('Login after signup response:', loginResponse.data);
      const { token } = loginResponse.data;

      const user = { id: userId, email, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signUp,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};