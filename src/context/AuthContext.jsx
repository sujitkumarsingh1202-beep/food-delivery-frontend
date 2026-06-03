import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN FUNCTION (FIXED)
  const login = async (username, password) => {
    try {
      console.log('Attempting login for:', username);

      const response = await api.post('/auth/login', {
        username,
        password
      });

      console.log("Login response:", response.data);

      // 🔥 IMPORTANT FIX
      const { accessToken, refreshToken, message } = response.data;

      if (accessToken) {
        localStorage.setItem('token', accessToken);

        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // 1. ROLE DETECTION (Fallback if backend doesn't send role)
        const role = username.toLowerCase() === 'admin' ? 'ADMIN' : 'USER';
        
        const userData = { username, role };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }

      return { success: false, message: 'No token received' };

    } catch (error) {
      console.error('Login error:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // ✅ SIGNUP FUNCTION
  const signup = async (userData) => {
    try {
      const requestData = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };

      console.log('Signup request:', requestData);

      const response = await api.post('/auth/signup', requestData);

      console.log('Signup success:', response.data);

      return { success: true };

    } catch (error) {
      console.error('Signup error:', error.response?.data);

      let errorMessage = 'Signup failed';

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      return { success: false, message: errorMessage };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ✅ CHECK ADMIN (basic)
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ HOOK
export const useAuth = () => useContext(AuthContext);