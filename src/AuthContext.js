import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserType && storedUserId) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      setUserId(storedUserId);
    }
  }, []);

  const login = (user, token) => {
    setIsLoggedIn(true);
    setUserType(user.tipo);
    setUserId(user._id);

    localStorage.setItem('token', token);
    localStorage.setItem('userType', user.tipo);
    localStorage.setItem('userId', user._id);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType('');
    setUserId('');

    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);