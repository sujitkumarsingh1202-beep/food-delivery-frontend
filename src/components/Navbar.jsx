import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, LayoutDashboard, UtensilsCrossed, Menu, X, Bell, Heart } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-200' 
        : 'bg-white/60 backdrop-blur-lg border-b border-slate-100'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <UtensilsCrossed className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-primary-600 via-primary-500 to-pink-500 bg-clip-text text-transparent">
                FoodDash
              </span>
              <p className="text-xs font-bold text-slate-500">Fast • Fresh • Delicious</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-slate-700 hover:text-primary-600 font-semibold transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-slate-700 hover:text-primary-600 font-semibold transition-colors flex items-center gap-2 relative group"
                >
                  <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                {/* Notification Icon */}
                <button className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors group">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Bell className="w-5 h-5 relative group-hover:scale-110 transition-transform" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                </button>

                {/* Wishlist Icon */}
                <button className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors group">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Heart className="w-5 h-5 relative group-hover:scale-110 transition-transform" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full border border-slate-200 hover:border-primary-300 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{user.name}</span>
                </div>

                {/* Logout */}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-primary-600 transition-colors hover:bg-primary-50 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 text-slate-700 font-bold hover:text-primary-600 transition-colors relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2.5 btn-gradient text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <button className="p-2 text-primary-600">
                <Bell className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2.5 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-4 space-y-3 animate-in fade-in slide-in-from-top-4 border-t border-slate-100">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)} 
              className="block text-slate-700 font-semibold px-4 py-2.5 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)} 
                  className="block text-slate-700 font-semibold px-4 py-2.5 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsOpen(false)} 
                    className="block text-primary-600 font-bold px-4 py-2.5 bg-primary-50 rounded-lg transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }} 
                    className="w-full text-center py-2.5 text-primary-600 font-bold border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="text-center py-2.5 text-slate-700 font-bold border-2 border-slate-200 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-all"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)} 
                  className="text-center py-2.5 btn-gradient text-white font-bold rounded-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
