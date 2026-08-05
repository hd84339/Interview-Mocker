import { useState } from "react";
import { Sparkles, ArrowRight, Menu, X, ChevronRight, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  const userName = user?.full_name || user?.displayName || user?.name;
  const userAvatar = user?.avatar_url || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Mock<span className="text-blue-600">Hora</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors py-1">
              Features
            </a>
            <a href="#interactive-demo" className="hover:text-blue-600 transition-colors py-1">
              Interactive Demo
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors py-1">
              How It Works
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors py-1">
              FAQ
            </a>
            <div className="flex items-center gap-2">
              <a href="#pricing" className="hover:text-blue-600 transition-colors py-1">
                Pricing
              </a>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200/60 uppercase tracking-wide">
                Free Tier
              </span>
            </div>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
                  <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full border border-slate-200" />
                  <span className="text-sm font-semibold text-slate-700">{userName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/create-interview"
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="p-2.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <a
              href="#features"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <span>Features</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#interactive-demo"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <span>Interactive Demo</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#how-it-works"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#faq"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <span>FAQ</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full border border-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{userName}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full text-center py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-100 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/create-interview"
                  onClick={closeMobileMenu}
                  className="w-full text-center py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
