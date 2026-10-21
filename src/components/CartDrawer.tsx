import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Coffee, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-slate/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F4] shadow-2xl flex flex-col border-l border-brand-cream-dark animate-slide-left">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-brand-cream-dark flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-sage-pale flex items-center justify-center text-brand-green">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-green">Pesanan Anda</h2>
                <p className="text-xs text-brand-slate/60">
                  {totalItems} item dipilih di keranjang
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-brand-slate/70 hover:bg-brand-cream-dark transition"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-24 px-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-cream-dark mx-auto flex items-center justify-center text-brand-terracotta">
                  <Coffee className="w-8 h-8 opacity-70" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-green">Keranjang Masih Kosong</h4>
                  <p className="text-xs text-brand-slate/70 mt-1 max-w-xs mx-auto">
                    Belum ada menu yang dipilih. Yuk eksplor sajian kopi artisan & santapan lezat FEBI!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-brand-green text-white text-xs font-semibold rounded-xl hover:bg-brand-green-light transition shadow-sm"
                >
                  Lihat Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-xs font-bold text-brand-slate/60 uppercase tracking-wider">
                    Daftar Pesanan
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Kosongkan
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 bg-white rounded-2xl border border-brand-cream-dark shadow-xs flex gap-3.5 items-start group hover:border-brand-sand transition"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-brand-cream-dark"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs sm:text-sm font-bold text-brand-green truncate pr-2">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500 transition p-0.5"
                          title="Hapus item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization pills */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.customization.temperature && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-cream-dark text-brand-green font-medium">
                            {item.customization.temperature}
                          </span>
                        )}
                        {item.customization.sweetness && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-cream-dark text-brand-slate font-medium">
                            {item.customization.sweetness.split(' ')[0]}
                          </span>
                        )}
                        {item.customization.milk && item.customization.milk !== 'Regular Milk' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-brand-terracotta font-medium border border-amber-200">
                            {item.customization.milk.split(' (')[0]}
                          </span>
                        )}
                      </div>

                      {item.customization.specialInstructions && (
                        <p className="text-[11px] text-brand-slate/60 italic mt-1 line-clamp-1">
                          "{item.customization.specialInstructions}"
                        </p>
                      )}

                      {/* Price & Quantity controllers */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                        <span className="text-xs font-bold text-brand-terracotta">
                          Rp {item.totalPrice.toLocaleString('id-ID')}
                        </span>

                        <div className="flex items-center gap-2 bg-brand-cream rounded-lg p-0.5 border border-brand-cream-dark">
                          <button
                            onClick={() => updateQty(item.cartItemId, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-brand-slate hover:bg-brand-cream-dark transition"
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-brand-green min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.cartItemId, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-brand-slate hover:bg-brand-cream-dark transition"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-brand-cream-dark space-y-3.5 shadow-lg">
              <div className="space-y-1.5 text-xs text-brand-slate/80">
                <div className="flex justify-between">
                  <span>Subtotal Pesanan</span>
                  <span className="font-semibold text-brand-green">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-brand-slate/60">
                  <span>Biaya Layanan & Pengemasan</span>
                  <span>Rp 2.000</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-sm">
                  <span className="font-bold text-brand-green">Total Pembayaran</span>
                  <span className="text-lg font-black text-brand-terracotta">
                    Rp {(subtotal + 2000).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-[0.99]"
              >
                <span>Konfirmasi & Bayar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
