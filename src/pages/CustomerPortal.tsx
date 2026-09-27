import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Download, PackageCheck, Clock } from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadCustomerData = async () => {
      const { data } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          payment_status,
          created_at,
          order_items (
            product_name,
            product_id,
            product:products(digital_file_url)
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    };

    loadCustomerData();
  }, [user]);

  return (
    <div className="min-h-screen bg-brand-navy py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Customer Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Logged in as <span className="text-teal-400">{user?.email}</span></p>
        </div>

        <div className="bg-brand-surface rounded-2xl border border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Your Purchased Digital Assets</h2>

          {loading ? (
            <p className="text-slate-400">Loading your purchases...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <PackageCheck size={48} className="mx-auto mb-2 text-slate-600" />
              <p>No orders found under this account.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-slate-800 p-5 rounded-xl bg-slate-900/60">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="font-mono text-sm font-bold text-teal-400">#{order.order_number}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      order.payment_status === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      Payment: {order.payment_status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">{item.product_name}</span>
                        {order.payment_status === 'paid' ? (
                          <a
                            href={item.product?.digital_file_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 bg-brand-teal hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            <Download size={14} />
                            <span>Download Files</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 flex items-center space-x-1">
                            <Clock size={12} />
                            <span>Pending Payment Verification</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
