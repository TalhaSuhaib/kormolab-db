import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/database';
import { useCart } from '../context/CartContext';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  const [heroData, setHeroData] = useState({
    headline: "Better Tools. Smarter Work. Bigger Dreams.",
    subheadline: "Digital products, business tools and smart solutions designed to make your work easier, faster and more productive.",
    banner_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  });

  useEffect(() => {
    const loadHomeData = async () => {
      // Load Dynamic Banner & Hero from Admin CMS
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        settings.forEach(s => {
          if (s.key === 'offers_and_banners') {
            setHeroData({
              headline: s.value.hero_headline || "Better Tools. Smarter Work. Bigger Dreams.",
              subheadline: s.value.hero_subheadline || "Digital products, business tools and smart solutions.",
              banner_image: s.value.hero_banner_image || ''
            });
          }
        });
      }

      // Load Products
      const { data: prods } = await supabase.from('products').select('*').eq('is_published', true).order('created_at', { ascending: false });
      if (prods) setProducts(prods);
    };

    loadHomeData();
  }, []);

  return (
    <div className="bg-[#0A192F] min-h-screen text-slate-100">
      {/* Hero Section with Live Banner Poster */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#112240] border border-teal-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-400 mb-6">
            <Sparkles size={14} />
            <span>KormoLab Production Digital Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {heroData.headline}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {heroData.subheadline}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#products"
              className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-teal-500/20 transition"
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Hero Promotional Poster from Admin */}
          {heroData.banner_image && (
            <div className="mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img src={heroData.banner_image} alt="KormoLab Special Banner" className="w-full h-auto object-cover max-h-[400px]" />
            </div>
          )}
        </div>
      </section>

      {/* Product Showcase */}
      <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Digital Tools & Templates</h2>
            <p className="text-slate-400 mt-2">Curated business sheets, AI kits, and productivity solutions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-[#112240] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="relative">
                  <img src={product.thumbnail_url || 'https://via.placeholder.com/600x300'} alt={product.name} className="w-full h-52 object-cover" />
                  {product.features && product.features[0] && (
                    <span className="absolute top-3 left-3 bg-teal-600 text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow">
                      {product.features[0]}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">{product.sku || 'DIGITAL TOOL'}</span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{product.short_description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-white">৳{product.sale_price || product.price}</span>
                  {product.sale_price && <span className="ml-2 text-sm text-slate-500 line-through">৳{product.price}</span>}
                </div>
                <button
                  onClick={() => {
                    addToCart(product);
                    alert(`${product.name} added to cart!`);
                  }}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
