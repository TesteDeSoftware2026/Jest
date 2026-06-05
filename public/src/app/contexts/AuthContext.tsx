import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  cpf?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'citizen' | 'admin') => Promise<boolean>;
  register: (name: string, email: string, cpf: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /**
   * ENDPOINT: POST /api/auth/login
   * Body: { email: string, password: string, role: 'citizen' | 'admin' }
   * Response: { token: string, user: User }
   */
  const login = async (email: string, password: string, role: 'citizen' | 'admin'): Promise<boolean> => {
    try {
      // TODO: Implementar chamada real à API
      // const response = await fetch(`${API_BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, role })
      // });
      //
      // if (!response.ok) {
      //   return false;
      // }
      //
      // const data = await response.json();
      // const { token, user } = data;
      //
      // // Salvar token e usuário
      // localStorage.setItem('authToken', token);
      // localStorage.setItem('authUser', JSON.stringify(user));
      // setToken(token);
      // setUser(user);
      //
      // return true;

      throw new Error('Backend não conectado - implementar endpoint POST /api/auth/login');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  /**
   * ENDPOINT: POST /api/auth/register
   * Body: { name: string, email: string, cpf: string, password: string }
   * Response: { token: string, user: User }
   */
  const register = async (name: string, email: string, cpf: string, password: string): Promise<boolean> => {
    try {
      // TODO: Implementar chamada real à API
      // const response = await fetch(`${API_BASE_URL}/auth/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, cpf, password })
      // });
      //
      // if (!response.ok) {
      //   return false;
      // }
      //
      // const data = await response.json();
      // const { token, user } = data;
      //
      // // Salvar token e usuário
      // localStorage.setItem('authToken', token);
      // localStorage.setItem('authUser', JSON.stringify(user));
      // setToken(token);
      // setUser(user);
      //
      // return true;

      throw new Error('Backend não conectado - implementar endpoint POST /api/auth/register');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  const logout = () => {
    // Limpar token e usuário do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Helper para obter o token de autenticação nas chamadas de API
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};
