import React, { createContext, useContext, useState } from 'react';

// Створення контексту авторизації
const AuthContext = createContext(null);

// Провайдер авторизації
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Функція входу
  const login = (email, password) => {
    // Симуляція перевірки даних (в реальному застосунку — API запит)
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ email, name: email.split('@')[0] });
      return { success: true };
    }
    return { success: false, error: 'Невірний email або пароль' };
  };

  // Функція реєстрації
  const register = (email, password, name) => {
    if (email && password && name) {
      setIsAuthenticated(true);
      setUser({ email, name });
      return { success: true };
    }
    return { success: false, error: 'Заповніть усі поля' };
  };

  // Функція виходу
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для використання контексту
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
