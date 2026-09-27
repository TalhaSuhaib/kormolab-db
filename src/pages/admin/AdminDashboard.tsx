import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  Package, 
  Palette, 
  Image as ImageIcon, 
  Megaphone, 
  Tags, 
  Percent, 
  ShoppingBag, 
  Trash2, 
  Edit3, 
  Plus, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  MessageCircle,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'banners' | 'branding' | 'categories' | 'coupons' | 'orders'>('overview');
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0
  });

  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Brand, Logo & Color Settings
  const [brandingSettings, setBrandingSettings] = useState({
    brand_name: 'KormoLab',
    logo_url: '',
    tagline: 'Better Tools • Smarter Work • Bigger Dreams',
    primary_color: '#0D9488',
    support_phone: '01717488371',
    support_email: 'support@kormolab.com'
  });

  // Banner, Poster & Offer Settings
  const [offerSettings, setOfferSettings] = useState({
    announcement_enabled: true,
    announcement_text: '🔥 Launch Offer — Use Code KORMO20 for 20% OFF On All Digital Products!',
    announcement_link: '/products',
    announcement_bg: '#0F766E',
    hero_headline: 'Better Tools. Smarter Work. Bigger Dreams.',
    hero_subheadline: 'Digital products, business tools and smart solutions designed to make your work easier, faster and more productive.',
    hero_banner_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    hero_cta_text: 'Explore Products',
    promo_popup_enabled: false,
    promo_popup_image: '',
    promo_popup_title: 'Special 50% Off Today!',
    promo_popup_code: 'MEGA50'
  });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    sale_price: '',
    short_description: '',
    category_id: '',
    thumbnail_url: '',
    digital_file_url: '',
    badge_text: 'NEW',
    is_featured: true
  });

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Category & Coupon states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage',
    discount_amount: '',
    min_order_amount: '0'
  });

  // Load All System Data
  const loadMasterData = async () => {
    setLoading(true);
    try {
      // 1. Orders & Stats
      const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (orderData) {
        setOrders(orderData);
        const revenue = orderData.reduce((acc, curr) => acc + (curr.payment_status === 'paid' ? Number(curr.total_amount) : 0), 0);
        setStats({
          totalSales: revenue,
          totalOrders: orderData.length,
          pendingOrders: orderData.filter(o => o.status === 'pending').length,
          totalProducts: 0
        });
      }

      // 2. Products
      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prodData) {
        setProducts(prodData);
        setStats(prev => ({ ...prev, totalProducts: prodData.length }));
      }

      // 3. Categories
      const { data: catData } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (catData) setCategories(catData);

      // 4. Coupons
      const { data: coupData } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (coupData) setCoupons(coupData);

      // 5. Site Settings (Branding & Offers)
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        settings.forEach(s => {
          if (s.key === 'branding') setBrandingSettings(s.value);
          if (s.key === 'offers_and_banners') setOfferSettings(s.value);
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  // Save Branding & Visual Theme
  const handleSaveBranding = async () => {
    await supabase.from('site_settings').upsert({
      key: 'branding',
      value: brandingSettings,
      updated_at: new Date().toISOString()
    });
    alert('Brand, Logo, and Colors updated live on website!');
  };

  // Save Banners & Promotional Offers
  const handleSaveOffers = async () => {
    await supabase.from('site_settings').upsert({
      key: 'offers_and_banners',
      value: offerSettings,
      updated_at: new Date().toISOString()
    });
    alert('Announcement Bar, Hero Banner, and Offers updated live!');
  };

  // Product Add
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const slug = newProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const { error } = await supabase.from('products').insert({
      name: newProduct.name,
      slug,
      sku: `KL-${Math.floor(100 + Math.random() * 900)}`,
      price: parseFloat(newProduct.price),
      sale_price: newProduct.sale_price ? parseFloat(newProduct.sale_price) : null,
      short_description: newProduct.short_description,
      category_id: newProduct.category_id || null,
      thumbnail_url: newProduct.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      digital_file_url: newProduct.digital_file_url,
      features: [newProduct.badge_text],
      is_featured: newProduct.is_featured,
      is_published: true
    });

    if (!error) {
      alert('Product published live with full details!');
      setNewProduct({ name: '', price: '', sale_price: '', short_description: '', category_id: '', thumbnail_url: '', digital_file_url: '', badge_text: 'NEW', is_featured: true });
      loadMasterData();
    }
  };

  // Product Edit
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { error } = await supabase.from('products').update({
      name: editingProduct.name,
      price: parseFloat(editingProduct.price),
      sale_price: editingProduct.sale_price ? parseFloat(editingProduct.sale_price) : null,
      short_description: editingProduct.short_description,
      digital_file_url: editingProduct.digital_file_url,
      thumbnail_url: editingProduct.thumbnail_url,
      is_published: editingProduct.is_published,
      is_featured: editingProduct.is_featured
    }).eq('id', editingProduct.id);

    if (!error) {
      alert('Product details successfully updated!');
      setEditingProduct(null);
      loadMasterData();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product permanently?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadMasterData();
  };

  // Category & Coupon handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    const slug = newCategoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    await supabase.from('categories').insert({ name: newCategoryName, slug, is_active: true });
    setNewCategoryName('');
    loadMasterData();
  };

  const handleDeleteCategory = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    loadMasterData();
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount_amount) return;
    await supabase.from('coupons').insert({
      code: newCoupon.code.toUpperCase(),
      discount_type: newCoupon.discount_type,
      discount_amount: parseFloat(newCoupon.discount_amount),
      min_order_amount: parseFloat(newCoupon.min_order_amount || '0'),
      is_active: true
    });
    setNewCoupon({ code: '', discount_type: 'percentage', discount_amount: '', min_order_amount: '0' });
    loadMasterData();
  };

  const handleDeleteCoupon = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    loadMasterData();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus: string) => {
    await supabase.from('orders').update({ status: status as any, payment_status: paymentStatus as any }).eq('id', orderId);
    loadMasterData();
  };

  return (
    <div className="min-h-screen bg-[#020C1B] text-slate-100 pb-20">
      {/* Top Bar */}
      <header className="bg-[#112240] border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">KormoLab Admin CMS</h1>
            <p className="text-xs font-mono text-teal-400">Identity: kormolab.admin@gmail.com</p>
          </div>
          <button
            onClick={loadMasterData}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Live DB</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#0A192F] border-b border-slate-800 px-4 sticky top-[73px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex space-x-2 overflow-x-auto py-3 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'branding', label: 'Logo & Colors', icon: Palette },
            { id: 'banners', label: 'Banners & Offers', icon: Megaphone },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Tags },
            { id: 'coupons', label: 'Discounts / Coupons', icon: Percent },
            { id: 'orders', label: 'Orders & Verification', icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#112240] p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Revenue</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">৳{stats.totalSales}</p>
              </div>
              <div className="bg-[#112240] p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-1">{stats.totalOrders}</p>
              </div>
              <div className="bg-[#112240] p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">Pending Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{stats.pendingOrders}</p>
              </div>
              <div className="bg-[#112240] p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">Live Products</span>
                <p className="text-2xl sm:text-3xl font-black text-teal-400 mt-1">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div onClick={() => setActiveTab('branding')} className="bg-[#112240] p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-teal-500 transition">
                <Palette className="text-teal-400 mb-2" size={24} />
                <h3 className="font-bold text-white">Brand Logo & Colors</h3>
                <p className="text-xs text-slate-400 mt-1">Change website logo image, brand text, and primary color system.</p>
              </div>
              <div onClick={() => setActiveTab('banners')} className="bg-[#112240] p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-teal-500 transition">
                <Megaphone className="text-teal-400 mb-2" size={24} />
                <h3 className="font-bold text-white">Banners & Top Offer Bar</h3>
                <p className="text-xs text-slate-400 mt-1">Set announcement ticker, hero poster, and promotional popup.</p>
              </div>
              <div onClick={() => setActiveTab('products')} className="bg-[#112240] p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-teal-500 transition">
                <Package className="text-teal-400 mb-2" size={24} />
                <h3 className="font-bold text-white">Full Product Inventory</h3>
                <p className="text-xs text-slate-400 mt-1">Manage digital files, prices, sale offers, and featured badges.</p>
              </div>
            </div>
          </div>
        )}

        {/* BRANDING, LOGO & COLORS */}
        {activeTab === 'branding' && (
          <div className="bg-[#112240] p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Logo & Brand Identity Control</h2>
              <p className="text-xs text-slate-400">Everything saved here updates the header, footer, and branding live.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Brand Name</label>
                <input
                  value={brandingSettings.brand_name}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, brand_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Logo Image URL (Optional)</label>
                <input
                  placeholder="https://... (leave empty for text logo)"
                  value={brandingSettings.logo_url}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Brand Tagline</label>
                <input
                  value={brandingSettings.tagline}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, tagline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Primary Brand Accent Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brandingSettings.primary_color}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, primary_color: e.target.value })}
                    className="w-12 h-10 rounded-lg cursor-pointer bg-slate-900 border border-slate-700 p-1"
                  />
                  <input
                    value={brandingSettings.primary_color}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, primary_color: e.target.value })}
                    className="flex-grow bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Support Phone / Hotline</label>
                <input
                  value={brandingSettings.support_phone}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, support_phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSaveBranding}
              className="flex items-center justify-center space-x-2 w-full bg-teal-600 hover:bg-teal-500 font-bold py-3.5 rounded-xl text-sm transition shadow-lg"
            >
              <Save size={16} />
              <span>Save & Publish Branding Changes</span>
            </button>
          </div>
        )}

        {/* BANNERS, POSTERS & OFFERS */}
        {activeTab === 'banners' && (
          <div className="bg-[#112240] p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Banners, Posters & Announcement Offers</h2>
              <p className="text-xs text-slate-400">Control promotional banners and top offer bars across the website.</p>
            </div>

            {/* Top Offer Bar */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Top Announcement / Offer Bar</h3>
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offerSettings.announcement_enabled}
                    onChange={(e) => setOfferSettings({ ...offerSettings, announcement_enabled: e.target.checked })}
                    className="rounded text-teal-500"
                  />
                  <span>Show Top Bar</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Offer Bar Text</label>
                <input
                  value={offerSettings.announcement_text}
                  onChange={(e) => setOfferSettings({ ...offerSettings, announcement_text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Bar Click Link</label>
                  <input
                    value={offerSettings.announcement_link}
                    onChange={(e) => setOfferSettings({ ...offerSettings, announcement_link: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Bar Background Color</label>
                  <input
                    type="color"
                    value={offerSettings.announcement_bg}
                    onChange={(e) => setOfferSettings({ ...offerSettings, announcement_bg: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer bg-slate-950 border border-slate-700 p-1"
                  />
                </div>
              </div>
            </div>

            {/* Hero Banner & Poster */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Hero Banner Poster & Headlines</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Hero Main Headline</label>
                <input
                  value={offerSettings.hero_headline}
                  onChange={(e) => setOfferSettings({ ...offerSettings, hero_headline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Hero Subheadline</label>
                <textarea
                  rows={2}
                  value={offerSettings.hero_subheadline}
                  onChange={(e) => setOfferSettings({ ...offerSettings, hero_subheadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Hero Promotional Poster / Image URL</label>
                <input
                  placeholder="https://... (Direct image link)"
                  value={offerSettings.hero_banner_image}
                  onChange={(e) => setOfferSettings({ ...offerSettings, hero_banner_image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg text-sm text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSaveOffers}
              className="flex items-center justify-center space-x-2 w-full bg-teal-600 hover:bg-teal-500 font-bold py-3.5 rounded-xl text-sm transition shadow-lg"
            >
              <Save size={16} />
              <span>Save & Publish Banners & Offers</span>
            </button>
          </div>
        )}

        {/* PRODUCTS (ADD, EDIT, DELETE) */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="bg-[#112240] p-6 rounded-2xl border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Plus size={18} className="text-teal-400" />
                <span>Add Product with Attributes & Badges</span>
              </h2>
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Product Title *"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  required
                  type="number"
                  placeholder="Regular Price (৳) *"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <input
                  type="number"
                  placeholder="Discounted Sale Price (৳)"
                  value={newProduct.sale_price}
                  onChange={(e) => setNewProduct({ ...newProduct, sale_price: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <input
                  placeholder="Thumbnail Image URL"
                  value={newProduct.thumbnail_url}
                  onChange={(e) => setNewProduct({ ...newProduct, thumbnail_url: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <input
                  placeholder="Badge Text (e.g. HOT, 30% OFF, PRO)"
                  value={newProduct.badge_text}
                  onChange={(e) => setNewProduct({ ...newProduct, badge_text: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <input
                  placeholder="Private Download Link (Google Drive / Canva / Sheets) *"
                  value={newProduct.digital_file_url}
                  onChange={(e) => setNewProduct({ ...newProduct, digital_file_url: e.target.value })}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <textarea
                  rows={2}
                  placeholder="Short Description"
                  value={newProduct.short_description}
                  onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <div className="sm:col-span-2">
                  <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.is_featured}
                      onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                      className="rounded text-teal-500"
                    />
                    <span>Feature on Homepage Showcase</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="sm:col-span-2 bg-teal-600 hover:bg-teal-500 font-bold py-3 rounded-xl text-sm transition shadow-lg"
                >
                  Publish Product Live
                </button>
              </form>
            </div>

            {/* List */}
            <div className="bg-[#112240] rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h3 className="font-bold text-white">All Products ({products.length})</h3>
              </div>
              <div className="divide-y divide-slate-800">
                {products.map((p) => (
                  <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img src={p.thumbnail_url} alt="" className="w-14 h-14 object-cover rounded-xl border border-slate-700" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-sm">{p.name}</h4>
                          {p.features && p.features[0] && (
                            <span className="text-[10px] bg-teal-950 text-teal-400 border border-teal-500/30 px-1.5 py-0.5 rounded font-bold">
                              {p.features[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                          <span className="font-bold text-teal-400">৳{p.sale_price || p.price}</span>
                          {p.sale_price && <span className="line-through text-slate-500">৳{p.price}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-2 rounded-lg bg-slate-800 text-teal-400 hover:bg-slate-700"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-slate-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#112240] p-6 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-4">Add Product Category</h2>
              <form onSubmit={handleCreateCategory} className="flex gap-3">
                <input
                  required
                  placeholder="Category Name (e.g. Excel Templates, AI Tools)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-grow bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <button type="submit" className="bg-teal-600 hover:bg-teal-500 font-bold px-6 py-2.5 rounded-xl text-sm whitespace-nowrap">
                  Add Category
                </button>
              </form>
            </div>

            <div className="bg-[#112240] rounded-2xl border border-slate-800 p-4">
              <div className="space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-medium text-sm text-slate-200">{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-[#112240] p-6 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-4">Create Promo Discount Coupon</h2>
              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  required
                  placeholder="Code (e.g. SAVE20)"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white uppercase"
                />
                <select
                  value={newCoupon.discount_type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed BDT (৳)</option>
                </select>
                <input
                  required
                  type="number"
                  placeholder="Discount Amount"
                  value={newCoupon.discount_amount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount_amount: e.target.value })}
                  className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-white"
                />
                <button type="submit" className="bg-teal-600 hover:bg-teal-500 font-bold py-2.5 rounded-xl text-sm transition">
                  Create Coupon
                </button>
              </form>
            </div>

            <div className="bg-[#112240] rounded-2xl border border-slate-800 p-4">
              <div className="space-y-2">
                {coupons.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-mono font-bold text-teal-400">{c.code} ({c.discount_amount}{c.discount_type === 'percentage' ? '%' : '৳'} OFF)</span>
                    <button onClick={() => handleDeleteCoupon(c.id)} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS & DIRECT WHATSAPP */}
        {activeTab === 'orders' && (
          <div className="bg-[#112240] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Customer Orders ({orders.length})</h3>
            </div>
            <div className="divide-y divide-slate-800">
              {orders.map((ord) => {
                const customerWaUrl = `https://wa.me/88${ord.guest_phone}?text=Hello%20${encodeURIComponent(ord.guest_name || 'Customer')},%20this%20is%20KormoLab.%20Regarding%20your%20Order%20%23${ord.order_number}...`;
                return (
                  <div key={ord.id} className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-teal-400 text-sm">#{ord.order_number}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{ord.guest_name} • {ord.guest_phone || 'No Phone'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          ord.payment_status === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {ord.payment_status.toUpperCase()}
                        </span>
                        <span className="text-sm font-bold text-white">৳{ord.total_amount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <div className="flex items-center space-x-2">
                        {ord.payment_status !== 'paid' ? (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'completed', 'paid')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                          >
                            <CheckCircle size={14} />
                            <span>Mark Paid & Unlock</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'pending', 'unpaid')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg"
                          >
                            Revoke Access
                          </button>
                        )}

                        {ord.guest_phone && (
                          <a
                            href={customerWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-teal-950 text-teal-400 border border-teal-500/30 text-xs px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{new Date(ord.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#112240] border border-slate-700 p-6 rounded-2xl max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
                <input
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Regular Price</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Sale Price</label>
                  <input
                    type="number"
                    value={editingProduct.sale_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Digital File URL</label>
                <input
                  value={editingProduct.digital_file_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, digital_file_url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.short_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-lg text-xs bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-500">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
