import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    notes: '',
    paymentMethod: 'bKash/Nagad Manual'
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Your cart is empty');
    setLoading(true);

    try {
      const orderNumber = `KL-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: user ? user.id : null,
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.phone,
          subtotal: subtotal,
          discount_amount: discount,
          total_amount: total,
          payment_method: formData.paymentMethod,
          customer_notes: formData.notes,
          status: 'pending',
          payment_status: 'unpaid'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.sale_price || item.product.price,
        quantity: item.quantity
      }));

      await supabase.from('order_items').insert(orderItems);

      const productLines = cart.map((i, index) => `${index + 1}. ${i.product.name} (Qty: ${i.quantity}) - ৳${(i.product.sale_price || i.product.price) * i.quantity}`).join('%0A');
      
      const whatsappMsg = `*KORMOLAB — NEW ORDER*%0A%0A` +
        `*Order ID:* %23${orderNumber}%0A%0A` +
        `*Customer Details:*%0A` +
        `Name: ${formData.name}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Email: ${formData.email}%0A%0A` +
        `*Products:*%0A${productLines}%0A%0A` +
        `*Total:* ৳${total}%0A` +
        `*Payment Method:* ${formData.paymentMethod}%0A` +
        `*Customer Note:* ${formData.notes || 'None'}`;

      const whatsappUrl = `https://wa.me/8801717488371?text=${whatsappMsg}`;

      setOrderSuccess({ orderNumber, whatsappUrl });
      clearCart();
    } catch (err: any) {
      alert(`Error submitting order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-brand-navy py-16 px-4">
        <div className="max-w-xl mx-auto bg-brand-surface border border-slate-800 p-8 rounded-2xl text-center">
          <CheckCircle2 size={64} className="text-teal-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Order Submitted Successfully!</h2>
          <p className="text-slate-300 mt-2">
            Your Order ID is <span className="font-mono font-bold text-teal-400">#{orderSuccess.orderNumber}</span>
          </p>

          <a
            href={orderSuccess.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            <MessageCircle size={20} />
            <span>Send Order Info to Admin WhatsApp (01717488371)</span>
          </a>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <button onClick={() => navigate('/portal')} className="text-sm text-slate-400 hover:text-white underline">
              Go to Customer Portal (View Purchases)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-brand-surface p-6 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Full Name *</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Email Address *</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Phone Number *</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white" />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl transition">
              {loading ? 'Processing...' : `Confirm Order (৳${total})`}
            </button>
          </form>

          <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800 h-fit space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Cart Summary</h3>
            <div className="space-y-3 text-sm">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-slate-300">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span className="font-semibold text-white">৳{(item.product.sale_price || item.product.price) * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
