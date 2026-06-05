import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#003DA5] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-white p-2 rounded-lg">
              <Heart className="w-8 h-8 text-[#003DA5]" fill="#003DA5" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Saúde Mental para Todos</h1>
              <p className="text-sm text-blue-100">Plataforma de Políticas Públicas</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'admin' ? '/admin' : '/minha-area'}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {user?.role === 'admin' ? 'Painel Admin' : 'Minha Área'}
                  </span>
                </Link>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  to="/cadastro" 
                  className="bg-white text-[#003DA5] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
