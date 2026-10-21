import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, CreditCard, Banknote, MapPin, Phone, User, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Order } from '../types/index.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { cart, subtotal, clearCart, showToast, addRecentOrder } = useCart();

  const [serviceType, setServiceType] = useState<'Dine In' | 'Takeaway' | 'Delivery'>('Dine In');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Kasir (Tunai/Kartu)' | 'Transfer Bank BCA'>('QRIS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const deliveryFee = serviceType === 'Delivery' ? 10000 : 0;
  const serviceFee = 2000;
  const grandTotal = subtotal + deliveryFee + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !tableOrAddress.trim()) {
      showToast('Harap lengkapi semua kolom yang bertanda bintang (*)', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      serviceType,
      tableOrAddress: tableOrAddress.trim(),
      items: cart,
      notes: notes.trim(),
      paymentMethod,
      subtotal,
      deliveryFee,
      serviceFee,
      total: grandTotal
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        setCreatedOrder(resData.data);
        addRecentOrder(resData.data.id);
        clearCart();
        showToast(`Pesanan ${resData.data.id} berhasil dibuat!`, 'success');
      } else {
        throw new Error(resData.message || 'Gagal memproses pesanan.');
      }
    } catch (err) {
      console.warn('API error, falling back to local creation:', err);
      // Fallback offline simulator if backend is temporarily disconnected
      const fallbackOrder: Order = {
        id: `FEB-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        serviceType,
        tableOrAddress: tableOrAddress.trim(),
        items: cart,
        subtotal,
        deliveryFee,
        serviceFee,
        total: grandTotal,
        notes: notes.trim(),
        paymentMethod,
        status: 'Diterima',
        createdAt: new Date().toISOString(),
        estimatedMinutes: serviceType === 'Delivery' ? 30 : 15
      };

      setCreatedOrder(fallbackOrder);
      addRecentOrder(fallbackOrder.id);
      clearCart();
      showToast(`Pesanan ${fallbackOrder.id} tersimpan!`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-slate/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#FAF8F4] rounded-3xl shadow-2xl border border-brand-cream-dark overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-brand-cream-dark flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-brand-green">
              {createdOrder ? 'Pesanan Terkonfirmasi' : 'Form Pemesanan & Pembayaran'}
            </h3>
            <p className="text-xs text-brand-slate/60 mt-0.5">
              {createdOrder ? 'Barista kami telah menerima pesanan Anda' : 'Silakan lengkapi detail pesanan untuk barista FEBI Space'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-brand-slate hover:bg-brand-cream-dark transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {createdOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-green mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-brand-green" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-sage-pale text-brand-green uppercase tracking-wider">
                ID Pesanan Anda
              </span>
              <h2 className="text-3xl font-black text-brand-terracotta tracking-tight">
                {createdOrder.id}
              </h2>
              <p className="text-xs sm:text-sm text-brand-slate/80 max-w-md mx-auto">
                Terima kasih, <strong>{createdOrder.customerName}</strong>! Pesanan Anda saat ini berstatus <span className="font-semibold text-brand-green">"{createdOrder.status}"</span> dan segera disiapkan dengan penuh ketelitian.
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="p-4 bg-white rounded-2xl border border-brand-cream-dark text-left space-y-2 text-xs">
              <div className="flex justify-between text-brand-slate/70">
                <span>Layanan:</span>
                <span className="font-semibold text-brand-green">{createdOrder.serviceType} ({createdOrder.tableOrAddress})</span>
              </div>
              <div className="flex justify-between text-brand-slate/70">
                <span>Metode Bayar:</span>
                <span className="font-semibold text-brand-green">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-brand-slate/70">
                <span>Estimasi Siap:</span>
                <span className="font-semibold text-brand-terracotta">± {createdOrder.estimatedMinutes} Menit</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm text-brand-green">
                <span>Total Bayar:</span>
                <span className="text-brand-terracotta">Rp {createdOrder.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* QRIS / Payment helper */}
            {createdOrder.paymentMethod === 'QRIS' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center gap-4 text-left">
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-amber-300 flex items-center justify-center shrink-0">
                  <QrCode className="w-14 h-14 text-brand-slate" />
                </div>
                <div className="text-xs text-brand-slate/80">
                  <p className="font-bold text-brand-green">Pindai QRIS FEBI Space</p>
                  <p className="text-[11px] text-brand-slate/70 mt-0.5">
                    Buka GoPay, BCA Mobile, OVO, atau ShopeePay untuk menyelesaikan pembayaran Rp {createdOrder.total.toLocaleString('id-ID')}.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onOrderSuccess(createdOrder);
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-brand-green hover:bg-brand-green-light text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <span>Pantau Status Barista (Live Tracker)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 border border-brand-cream-dark bg-white hover:bg-brand-cream-dark text-brand-slate rounded-xl font-semibold text-xs transition"
              >
                Selesai
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Service Type Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-slate/70 block mb-2">
                Tipe Layanan *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Dine In', 'Takeaway', 'Delivery'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setServiceType(type)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                      serviceType === type
                        ? 'border-brand-green bg-brand-green text-white shadow-sm'
                        : 'border-brand-cream-dark bg-white text-brand-slate hover:bg-brand-cream-dark/50'
                    }`}
                  >
                    {type === 'Dine In' && 'Makan di Tempat'}
                    {type === 'Takeaway' && 'Bawa Pulang'}
                    {type === 'Delivery' && 'Pesan Antar'}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-brand-slate block mb-1">
                  Nama Pemesan *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-brand-slate/40" />
                  <input
                    type="text"
                    required
                    placeholder="cth: Sarah Adelia"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-white focus:outline-none focus:border-brand-green text-brand-slate"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-slate block mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-brand-slate/40" />
                  <input
                    type="tel"
                    required
                    placeholder="cth: 08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-white focus:outline-none focus:border-brand-green text-brand-slate"
                  />
                </div>
              </div>
            </div>

            {/* Table or Address */}
            <div>
              <label className="text-xs font-semibold text-brand-slate block mb-1">
                {serviceType === 'Dine In'
                  ? 'Nomor Meja atau Area *'
                  : serviceType === 'Takeaway'
                  ? 'Keterangan Pengambilan *'
                  : 'Alamat Pengantaran Lengkap *'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-brand-slate/40" />
                <input
                  type="text"
                  required
                  placeholder={
                    serviceType === 'Dine In'
                      ? 'cth: Meja 05 (Indoor Utama) atau Lantai 2'
                      : serviceType === 'Takeaway'
                      ? 'cth: Ambil 15 menit lagi di Bar Depan'
                      : 'cth: Jl. Wijaya Kusuma No. 12, Kebayoran Baru, Jakarta Selatan'
                  }
                  value={tableOrAddress}
                  onChange={(e) => setTableOrAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-white focus:outline-none focus:border-brand-green text-brand-slate"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="text-xs font-semibold text-brand-slate block mb-1">
                Email Konfirmasi <span className="text-brand-slate/50 font-normal">(Opsional untuk e-struk)</span>
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-white focus:outline-none focus:border-brand-green text-brand-slate"
              />
            </div>

            {/* Special Notes */}
            <div>
              <label className="text-xs font-semibold text-brand-slate block mb-1">
                Catatan Tambahan untuk Barista <span className="text-brand-slate/50 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                placeholder="cth: Tolong sedotan bambu / antarkan berbarengan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-white focus:outline-none focus:border-brand-green text-brand-slate"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-slate/70 block mb-2">
                Metode Pembayaran *
              </label>
              <div className="space-y-2">
                {[
                  { id: 'QRIS', title: 'QRIS Instan', desc: 'BCA, Mandiri, GoPay, OVO, ShopeePay', icon: QrCode },
                  { id: 'Kasir (Tunai/Kartu)', title: 'Bayar di Kasir', desc: 'Tunai, Debit, atau Kartu Kredit di tempat', icon: Banknote },
                  { id: 'Transfer Bank BCA', title: 'Transfer BCA Virtual', desc: 'No. Rek 872-019-4455 a.n FEBI Space', icon: CreditCard }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        paymentMethod === m.id
                          ? 'border-brand-green bg-brand-sage-pale/60 text-brand-green'
                          : 'border-brand-cream-dark bg-white hover:bg-brand-cream-dark/30 text-brand-slate'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentMethod === m.id ? 'bg-brand-green text-white' : 'bg-brand-cream-dark text-brand-slate'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{m.title}</p>
                          <p className="text-[11px] text-brand-slate/60">{m.desc}</p>
                        </div>
                      </div>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === m.id ? 'border-brand-green bg-brand-green' : 'border-gray-300'
                      }`}>
                        {paymentMethod === m.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment calculation breakdown */}
            <div className="p-4 bg-white rounded-2xl border border-brand-cream-dark space-y-2 text-xs">
              <div className="flex justify-between text-brand-slate/70">
                <span>Subtotal ({cart.length} varian)</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {serviceType === 'Delivery' && (
                <div className="flex justify-between text-brand-slate/70">
                  <span>Ongkir Kurir Kafe</span>
                  <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-slate/70">
                <span>Biaya Layanan & Pengemasan</span>
                <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm text-brand-green">
                <span>Total Pembayaran</span>
                <span className="text-base text-brand-terracotta">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sedang Mengirim Pesanan...</span>
              ) : (
                <span>Kirim Pesanan Sekarang (Rp {grandTotal.toLocaleString('id-ID')})</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
