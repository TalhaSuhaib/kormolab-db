import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/database';
import { useCart } from '../context/CartContext';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [heroData, setHeroData] = useState({
    headline: "Better Tools. Smarter Work. Bigger Dreams.",
    subheadline: "Digital products, business tools and smart solutions designed to make your work easier, faster and more productive.",
    cta_text: "Explore Products"
  });

  useEffect(() => {
    const loadHomeData = async () => {
      const { data: settingData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero')
        .single();
      if (settingData?.value) setHeroData(settingData.value);

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .limit(6);
      if (products) setFeaturedProducts(products);
    };

    loadHomeData();
  }, []);

  return (
    <div className="bg-brand-navy min-h-screen text-slate-100">
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-brand-surface border border-teal-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-400 mb-8">
            <Sparkles size={14} />
            <span>KormoLab v1.0 Production Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
            {heroData.headline}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {heroData.subheadline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-teal hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-teal-500/20 transition">
              <span>{heroData.cta_text}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Featured Digital Tools</h2>
            <p className="text-slate-400 mt-2">Curated templates and frameworks to scale your efficiency.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-brand-surface border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <img src={product.thumbnail_url || 'https://via.placeholder.com/600x300'} alt={product.name} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">{product.sku || 'DIGITAL TOOL'}</span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm">{product.short_description}</p>
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
                  className="bg-brand-teal hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
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
