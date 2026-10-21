import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, Coffee, Sparkles, ChefHat, Bike, MessageCircle, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';

interface OrderTrackerModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ orderId, onClose }) => {
  const { showToast } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      }
    } catch (e) {
      console.warn('Failed to fetch order', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
      const interval = setInterval(() => {
        fetchOrder(orderId);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  if (!orderId) return null;

  const advanceStatus = async () => {
    if (!order) return;
    const flow: OrderStatus[] = ['Diterima', 'Sedang Diseduh', 'Siap Disajikan', 'Selesai'];
    const currentIndex = flow.indexOf(order.status);
    if (currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      setUpdating(true);
      try {
        const res = await fetch(`/api/orders/${order.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        });
        const d = await res.json();
        if (d.success && d.data) {
          setOrder(d.data);
          showToast(`Status pesanan diperbarui ke "${nextStatus}"!`, 'info');
        }
      } catch (err) {
        setOrder({ ...order, status: nextStatus });
      } finally {
        setUpdating(false);
      }
    }
  };

  const steps: { title: string; desc: string; icon: any; status: OrderStatus }[] = [
    { title: 'Diterima', desc: 'Tiket pesanan masuk antrean barista', icon: Clock, status: 'Diterima' },
    { title: 'Sedang Diseduh', desc: 'Barista & dapur sedang meracik dengan teliti', icon: Coffee, status: 'Sedang Diseduh' },
    { title: 'Siap Disajikan', desc: 'Pesanan siap diantar ke meja / diambil', icon: ChefHat, status: 'Siap Disajikan' },
    { title: 'Selesai', desc: 'Selamat menikmati sajian FEBI Space', icon: CheckCircle, status: 'Selesai' }
  ];

  const getStepIndex = (s: OrderStatus) => {
    return ['Diterima', 'Sedang Diseduh', 'Siap Disajikan', 'Selesai'].indexOf(s);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-slate/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#FAF8F4] rounded-3xl shadow-2xl border border-brand-cream-dark overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-brand-cream-dark flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-lg font-black text-brand-green">Live Barista Tracker</h3>
            </div>
            <p className="text-xs text-brand-slate/60 mt-0.5">
              Pantau tahapan peracikan pesanan Anda secara langsung
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-brand-slate hover:bg-brand-cream-dark transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading && !order ? (
            <div className="text-center py-12 text-xs text-brand-slate/60">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-terracotta mb-2" />
              Memuat data pesanan {orderId}...
            </div>
          ) : !order ? (
            <div className="text-center py-12 text-xs text-brand-slate/60">
              Pesanan dengan ID <span className="font-bold">{orderId}</span> tidak ditemukan.
            </div>
          ) : (
            <>
              {/* Order Identity Card */}
              <div className="p-4 bg-white rounded-2xl border border-brand-cream-dark flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-slate/60 uppercase tracking-wider">
                    Nomor Pesanan
                  </span>
                  <h4 className="text-xl font-black text-brand-terracotta">{order.id}</h4>
                  <p className="text-xs text-brand-slate/80 mt-0.5">
                    {order.customerName} • {order.serviceType} ({order.tableOrAddress})
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-brand-sage-pale text-brand-green">
                    {order.status}
                  </span>
                  <p className="text-[11px] text-brand-slate/60 mt-1">
                    Estimasi: ±{order.estimatedMinutes} mnt
                  </p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="p-5 bg-white rounded-2xl border border-brand-cream-dark space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-brand-slate/70">
                  Tahapan Pesanan
                </h5>

                <div className="relative pl-6 space-y-6 border-l-2 border-brand-cream-dark">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const Icon = step.icon;

                    return (
                      <div key={step.title} className="relative">
                        <div
                          className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-brand-green text-white shadow-xs'
                              : 'bg-white border-2 border-brand-cream-dark text-gray-300'
                          } ${isCurrent ? 'ring-4 ring-brand-sage-light' : ''}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isDone ? 'text-brand-green' : 'text-brand-slate/40'
                            }`}
                          >
                            {step.title} {isCurrent && <span className="text-[10px] text-brand-terracotta font-semibold ml-1">(Sedang Berlangsung)</span>}
                          </p>
                          <p className="text-[11px] text-brand-slate/60 mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4 bg-white rounded-2xl border border-brand-cream-dark space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-brand-slate/70">
                  Ringkasan Sajian
                </h5>
                <div className="space-y-2 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-brand-green">
                          {it.quantity}x {it.menuItem.name}
                        </p>
                        <p className="text-[10px] text-brand-slate/60">
                          {[
                            it.customization.temperature,
                            it.customization.sweetness?.split(' ')[0],
                            it.customization.milk?.split(' (')[0],
                            it.customization.specialInstructions
                          ].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                      <span className="font-bold text-brand-slate">
                        Rp {it.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between text-xs font-bold text-brand-green">
                  <span>Total Pembayaran ({order.paymentMethod}):</span>
                  <span className="text-sm text-brand-terracotta">
                    Rp {order.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Barista Simulation Helper & Contact */}
              <div className="flex flex-col gap-2 pt-1">
                {currentStepIdx < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={advanceStatus}
                    disabled={updating}
                    className="w-full py-2.5 px-4 bg-brand-cream-dark hover:bg-brand-sand text-brand-slate rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
                    <span>Simulasikan Barista Memajukan Status ({steps[currentStepIdx + 1].title})</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/6281288997700?text=Halo%20Barista%20FEBI%20Space,%20saya%20ingin%20menanyakan%20pesanan%20dengan%20ID%20${order.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 border border-brand-green text-brand-green hover:bg-brand-green hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Hubungi Barista / WhatsApp Kasir</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
