import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu as MenuIcon, 
  User,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  X,
  LogIn
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary-50' : 'text-white hover:text-primary-100';
  };

  const menuItems = [
    { path: '/psychologists', label: 'Психологи', icon: Users },
    { path: '/institutions', label: 'Образование', icon: GraduationCap },
    { path: '/articles', label: 'Статьи', icon: BookOpen },
    { path: '/pricing', label: 'Тарифы', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary-600 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: '"Nunito Sans", Sans-serif' }}>КПТ.рф</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 text-sm font-medium ${isActive(path)}`}
                  style={{ fontFamily: '"Montserrat", Sans-serif' }}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link 
                to="/search" 
                className="relative p-1 rounded-full text-white hover:text-primary-100 focus:outline-none"
                aria-label="Поиск"
              >
                <Search className="h-6 w-6" />
              </Link>
            </div>
            
            <div className="ml-4 hidden sm:block">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-primary-50 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Личный кабинет</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white hover:text-primary-100 transition-colors"
                  >
                    <span>Выйти</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 text-white hover:text-primary-100 transition"
                  >
                    <span>Регистрация</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-primary-50 transition"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Войти</span>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="ml-4 sm:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-white hover:text-primary-100 focus:outline-none"
                aria-label="Главное меню"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === path
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ fontFamily: '"Montserrat", Sans-serif' }}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </Link>
            ))}
            
            {/* Add mobile login/dashboard button */}
            <Link
              to={user ? `/dashboard${user.role === 'admin' ? '/admin' : ''}` : "/login"}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-100 hover:bg-primary-700 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontFamily: '"Montserrat", Sans-serif' }}
            >
              <User className="h-5 w-5 mr-3" />
              {user ? 'Личный кабинет' : 'Войти'}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;