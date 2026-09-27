import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-brand-navy border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-white flex items-center">
              KORMO<span className="text-brand-teal">LAB</span>
            </span>
            <span className="hidden sm:inline-block text-xs bg-slate-800 text-teal-400 px-2 py-0.5 rounded font-mono">
              v1.0
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/products" className="hover:text-white transition">All Products</Link>
            <Link to="/portal" className="hover:text-white transition">My Downloads</Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1.5 bg-brand-teal/20 text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-teal hover:text-white transition">
                <ShieldCheck size={16} />
                <span>Admin CMS</span>
              </Link>
            )}

            <Link to="/checkout" className="relative p-2 text-slate-300 hover:text-white transition">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-teal text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/portal" className="hidden sm:flex items-center space-x-1 text-sm text-slate-300 hover:text-white font-medium">
                  <User size={18} />
                  <span>Portal</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-rose-400 hover:text-rose-300 border border-rose-900/40 bg-rose-950/20 px-2.5 py-1.5 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 text-xs sm:text-sm bg-brand-teal hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg transition">
                <span>Login</span>
                <ArrowRight size={14} />
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2">Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2">All Products</Link>
          <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="block text-teal-400 font-medium py-2">My Downloads</Link>
        </div>
      )}
    </nav>
  );
};
