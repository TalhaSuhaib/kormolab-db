import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic branding & offer state
  const [branding, setBranding] = useState({ brand_name: 'KormoLab', logo_url: '' });
  const [announcement, setAnnouncement] = useState({
    enabled: true,
    text: '🔥 Launch Offer — Use Code KORMO20 for 20% OFF!',
    link: '/products',
    bg: '#0F766E'
  });

  useEffect(() => {
    const fetchNavbarSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        data.forEach(item => {
          if (item.key === 'branding') {
            setBranding({
              brand_name: item.value.brand_name || 'KormoLab',
              logo_url: item.value.logo_url || ''
            });
          }
          if (item.key === 'offers_and_banners') {
            setAnnouncement({
              enabled: item.value.announcement_enabled ?? true,
              text: item.value.announcement_text || '',
              link: item.value.announcement_link || '/products',
              bg: item.value.announcement_bg || '#0F766E'
            });
          }
        });
      }
    };
    fetchNavbarSettings();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Announcement Bar (Controlled from Admin) */}
      {announcement.enabled && announcement.text && (
        <a
          href={announcement.link}
          style={{ backgroundColor: announcement.bg }}
          className="block text-center text-xs sm:text-sm font-semibold text-white py-2 px-4 transition hover:opacity-95"
        >
          {announcement.text}
        </a>
      )}

      {/* Main Navbar */}
      <nav className="bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Dynamic Logo */}
            <Link to="/" className="flex items-center space-x-2">
              {branding.logo_url ? (
                <img src={branding.logo_url} alt={branding.brand_name} className="h-10 object-contain" />
              ) : (
                <span className="text-2xl font-black tracking-tight text-white flex items-center">
                  {branding.brand_name.toUpperCase()}
                </span>
              )}
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/products" className="hover:text-white transition">All Products</Link>
              <Link to="/portal" className="hover:text-white transition">My Downloads</Link>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1.5 bg-teal-500/20 text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-teal-500 hover:text-white transition"
                >
                  <ShieldCheck size={16} />
                  <span>Admin CMS</span>
                </Link>
              )}

              <Link to="/checkout" className="relative p-2 text-slate-300 hover:text-white transition">
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-teal-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
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
                <Link to="/login" className="flex items-center space-x-1 text-xs sm:text-sm bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg transition">
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

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#020C1B] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2">All Products</Link>
            <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="block text-teal-400 font-medium py-2">My Downloads</Link>
          </div>
        )}
      </nav>
    </header>
  );
};
