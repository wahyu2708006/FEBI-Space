import React, { useState } from 'react';
import { Search, Clock, Coffee, ChefHat, CheckCircle, RefreshCw, MessageCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Order, OrderStatus } from '../types/index.ts';

interface TrackOrderPageProps {
  setActivePage: (page: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ setActivePage }) => {
  const { recentOrders, setActiveTrackingId, showToast } = useCart();
  const [searchId, setSearchId] = useState(recentOrders[0] || 'FEB-782194');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [simulating, setSimulating] = useState(false);

  const fetchOrder = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/orders/${idToSearch.trim()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setErrorMsg(data.message || 'Pesanan tidak ditemukan.');
        setOrder(null);
      }
    } catch {
      setErrorMsg('Gagal terhubung ke sistem barista.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch initial order on mount if available
  React.useEffect(() => {
    if (searchId) {
      fetchOrder(searchId);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const advanceStatus = async () => {
    if (!order) return;
    const flow: OrderStatus[] = ['Diterima', 'Sedang Diseduh', 'Siap Disajikan', 'Selesai'];
    const currentIndex = flow.indexOf(order.status);
    if (currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      setSimulating(true);
      try {
        const res = await fetch(`/api/orders/${order.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        });
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
          showToast(`Status pesanan dimajukan ke "${nextStatus}"!`, 'info');
        }
      } catch {
        setOrder({ ...order, status: nextStatus });
      } finally {
        setSimulating(false);
      }
    }
  };

  const steps = [
    { title: 'Diterima', desc: 'Tiket pesanan masuk antrean barista', icon: Clock, status: 'Diterima' as OrderStatus },
    { title: 'Sedang Diseduh', desc: 'Barista meracik espresso & memanggang makanan', icon: Coffee, status: 'Sedang Diseduh' as OrderStatus },
    { title: 'Siap Disajikan', desc: 'Sajian telah siap diantar ke meja / diambil', icon: ChefHat, status: 'Siap Disajikan' as OrderStatus },
    { title: 'Selesai', desc: 'Pesanan telah selesai & dinikmati', icon: CheckCircle, status: 'Selesai' as OrderStatus }
  ];

  const currentStepIdx = order ? ['Diterima', 'Sedang Diseduh', 'Siap Disajikan', 'Selesai'].indexOf(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
          Pelacak Pesanan
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-green">
          Live Barista Order Tracker
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate/75">
          Masukkan ID pesanan Anda (contoh: FEB-782194) untuk melihat progres peracikan minuman dan hidangan secara langsung.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-brand-cream-dark shadow-xs space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate/40" />
            <input
              type="text"
              placeholder="Masukkan ID Pesanan (cth: FEB-782194)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-brand-cream-dark bg-brand-cream/30 focus:outline-none focus:border-brand-green uppercase font-semibold text-brand-green"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-green hover:bg-brand-green-light text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Lacak Pesanan</span>
          </button>
        </form>

        {/* Quick history buttons */}
        {recentOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-brand-slate/60 text-[11px] font-semibold">Pesanan Terakhir:</span>
            {recentOrders.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchId(id);
                  fetchOrder(id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  searchId === id
                    ? 'bg-brand-terracotta text-white shadow-xs'
                    : 'bg-brand-cream text-brand-green hover:bg-brand-cream-dark border border-brand-cream-dark'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="p-6 bg-red-50 rounded-3xl border border-red-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h4 className="text-sm font-bold text-red-800">{errorMsg}</h4>
          <p className="text-xs text-red-600 max-w-sm mx-auto">
            Pastikan format ID pesanan Anda benar (misal: FEB-782194) atau lakukan pemesanan baru melalui menu.
          </p>
          <button
            onClick={() => setActivePage('menu')}
            className="px-4 py-2 bg-brand-green text-white text-xs font-semibold rounded-xl"
          >
            Buka Katalog Menu
          </button>
        </div>
      )}

      {/* Live Order Display */}
      {order && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Status Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                    Status Barista Terkini
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-green mt-1">
                  {order.status}
                </h2>
                <p className="text-xs text-brand-slate/70 mt-1">
                  ID: <span className="font-bold text-brand-terracotta">{order.id}</span> • Pemesan: <strong>{order.customerName}</strong> ({order.serviceType})
                </p>
              </div>

              <div className="p-4 bg-brand-cream rounded-2xl border border-brand-cream-dark text-right sm:text-center">
                <span className="text-[10px] text-brand-slate/60 uppercase font-bold block">
                  Estimasi Saji
                </span>
                <span className="text-xl font-extrabold text-brand-terracotta">
                  ± {order.estimatedMinutes} Menit
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((st, i) => {
                const isPassed = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;
                const Icon = st.icon;

                return (
                  <div
                    key={st.title}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-brand-sage-pale border-brand-green ring-2 ring-brand-green/20'
                        : isPassed
                        ? 'bg-white border-brand-green/30'
                        : 'bg-white/50 border-gray-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
                          isPassed ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-brand-slate/50">
                        Langkah {i + 1}
                      </span>
                    </div>
                    <p className={`text-xs font-bold ${isPassed ? 'text-brand-green' : 'text-gray-400'}`}>
                      {st.title}
                    </p>
                    <p className="text-[11px] text-brand-slate/60 mt-1 leading-snug">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Simulation button */}
            {currentStepIdx < steps.length - 1 && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-amber-900">Uji Alur Pesanan (Demo Interaktif)</p>
                  <p className="text-[11px] text-amber-800">
                    Anda dapat memajukan tahapan barista secara manual untuk melihat perubahan status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={advanceStatus}
                  disabled={simulating}
                  className="px-4 py-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-bold rounded-xl transition shadow-xs shrink-0 cursor-pointer"
                >
                  {simulating ? 'Mengupdate...' : `Majukan ke: ${steps[currentStepIdx + 1].title}`}
                </button>
              </div>
            )}
          </div>

          {/* Receipt and Details Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-xs space-y-6">
            <h3 className="text-base font-bold text-brand-green">
              Rincian Nota & Pengantaran
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-xs pb-4 border-b border-gray-100">
              <div>
                <p className="text-brand-slate/60">Tujuan / Posisi:</p>
                <p className="font-bold text-brand-green mt-0.5">{order.tableOrAddress}</p>
              </div>
              <div>
                <p className="text-brand-slate/60">Kontak WhatsApp:</p>
                <p className="font-bold text-brand-green mt-0.5">{order.phone}</p>
              </div>
              <div>
                <p className="text-brand-slate/60">Metode Pembayaran:</p>
                <p className="font-bold text-brand-green mt-0.5">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-brand-slate/60">Waktu Pemesanan:</p>
                <p className="font-bold text-brand-green mt-0.5">
                  {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </p>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-brand-slate/70 uppercase tracking-wider">
                Item Yang Dipesan ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-brand-cream/60 rounded-xl border border-brand-cream-dark text-xs">
                    <div>
                      <span className="font-bold text-brand-green">
                        {it.quantity}x {it.menuItem.name}
                      </span>
                      <p className="text-[11px] text-brand-slate/60 mt-0.5">
                        {[
                          it.customization.temperature,
                          it.customization.sweetness,
                          it.customization.milk !== 'Regular Milk' ? it.customization.milk : null,
                          it.customization.specialInstructions
                        ].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                    <span className="font-bold text-brand-terracotta">
                      Rp {it.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="p-4 bg-brand-cream rounded-2xl border border-brand-cream-dark space-y-2 text-xs">
              <div className="flex justify-between text-brand-slate/70">
                <span>Subtotal</span>
                <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-brand-slate/70">
                  <span>Ongkos Kirim</span>
                  <span>Rp {order.deliveryFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-slate/70">
                <span>Biaya Layanan</span>
                <span>Rp {order.serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-extrabold text-sm text-brand-green">
                <span>Total Biaya</span>
                <span className="text-base text-brand-terracotta">
                  Rp {order.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/6281288997700?text=Halo%20Barista%20FEBI%20Space,%20saya%20ingin%20cek%20pesanan%20dengan%20ID%20${order.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 bg-brand-green hover:bg-brand-green-light text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Barista di WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setActivePage('menu')}
                className="py-3 px-5 border border-brand-cream-dark bg-white hover:bg-brand-cream-dark text-brand-slate rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Pesan Menu Lain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
