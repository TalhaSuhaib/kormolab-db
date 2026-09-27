import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FolderPlus, RefreshCw, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [digitalFileUrl, setDigitalFileUrl] = useState('');

  const loadData = async () => {
    const { data: orderData } = await supabase.from('orders').select('*');
    if (orderData) {
      const sales = orderData.reduce((acc, curr) => acc + (curr.payment_status === 'paid' ? Number(curr.total_amount) : 0), 0);
      setStats({
        totalSales: sales,
        totalOrders: orderData.length,
        pendingOrders: orderData.filter(o => o.status === 'pending').length,
        totalProducts: 0
      });
      setOrders(orderData);
    }

    const { data: prodData } = await supabase.from('products').select('*');
    if (prodData) {
      setStats(prev => ({ ...prev, totalProducts: prodData.length }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const slug = newProductName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const { error } = await supabase.from('products').insert({
      name: newProductName,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      sku: `KL-${Math.floor(100 + Math.random() * 900)}`,
      price: parseFloat(newProductPrice),
      short_description: newProductDesc,
      digital_file_url: digitalFileUrl,
      is_published: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    });

    if (!error) {
      setNewProductName('');
      setNewProductPrice('');
      setNewProductDesc('');
      setDigitalFileUrl('');
      loadData();
      alert('Product published live without code changes!');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus: string) => {
    await supabase.from('orders').update({
      status: status as any,
      payment_status: paymentStatus as any
    }).eq('id', orderId);
    loadData();
  };

  return (
    <div className="min-h-screen bg-brand-dark p-6 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">KormoLab Admin CMS</h1>
            <p className="text-xs font-mono text-teal-400 mt-1">SuperAdmin: kormolab.admin@gmail.com</p>
          </div>
          <button onClick={loadData} className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <RefreshCw size={14} />
            <span>Sync Live DB</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Revenue</span>
            <p className="text-3xl font-black text-emerald-400 mt-2">৳{stats.totalSales}</p>
          </div>
          <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Orders</span>
            <p className="text-3xl font-black text-white mt-2">{stats.totalOrders}</p>
          </div>
          <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Pending Action</span>
            <p className="text-3xl font-black text-amber-400 mt-2">{stats.pendingOrders}</p>
          </div>
          <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Live Products</span>
            <p className="text-3xl font-black text-teal-400 mt-2">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <FolderPlus size={20} className="text-teal-400" />
            <span>Publish New Product (Instant CMS Update)</span>
          </h2>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Product Name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-lg text-sm text-white" />
            <input required type="number" placeholder="Price (৳ BDT)" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-lg text-sm text-white" />
            <input placeholder="Short Description" value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-lg text-sm text-white" />
            <input placeholder="Private Download Link (Google Drive / Canva / Sheets)" value={digitalFileUrl} onChange={(e) => setDigitalFileUrl(e.target.value)} className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-lg text-sm text-white" />
            <button type="submit" className="md:col-span-2 bg-brand-teal hover:bg-teal-600 font-bold py-3 rounded-lg text-sm transition">
              Publish Product Live
            </button>
          </form>
        </div>

        <div className="bg-brand-surface rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Live Customer Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-teal-400">#{ord.order_number}</td>
                    <td className="p-4">{ord.guest_name || 'Customer'}</td>
                    <td className="p-4 font-bold text-white">৳{ord.total_amount}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        ord.payment_status === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      {ord.payment_status !== 'paid' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'completed', 'paid')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded transition flex items-center space-x-1"
                        >
                          <CheckCircle size={14} />
                          <span>Approve & Unlock</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
