import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Coffee, Sparkles, Check, Flame, Snowflake } from 'lucide-react';
import { MenuItem, OrderCustomization } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<'Iced' | 'Hot'>('Iced');
  const [sweetness, setSweetness] = useState<'Normal (100%)' | 'Less Sugar (50%)' | 'No Sugar (0%)'>('Normal (100%)');
  const [milk, setMilk] = useState<'Regular Milk' | 'Oat Milk (+Rp 6.000)' | 'Almond Milk (+Rp 7.000)'>('Regular Milk');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSpecialInstructions('');
      if (item.temperature === 'Hot') {
        setTemperature('Hot');
      } else {
        setTemperature('Iced');
      }
      setSweetness('Normal (100%)');
      setMilk('Regular Milk');
    }
  }, [item]);

  if (!item) return null;

  const isDrink = item.category === 'Coffee' || item.category === 'Non-Coffee';
  const hasMilkOption = isDrink && (item.name.toLowerCase().includes('latte') || item.name.toLowerCase().includes('cloud') || item.name.toLowerCase().includes('white') || item.name.toLowerCase().includes('matcha'));

  let milkExtra = 0;
  if (milk === 'Oat Milk (+Rp 6.000)') milkExtra = 6000;
  if (milk === 'Almond Milk (+Rp 7.000)') milkExtra = 7000;

  const unitPrice = item.price + milkExtra;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customization: OrderCustomization = {
      temperature: isDrink ? temperature : undefined,
      sweetness: isDrink ? sweetness : undefined,
      milk: hasMilkOption ? milk : undefined,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined
    };

    addToCart(item, customization, quantity);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-slate/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#FAF8F4] rounded-3xl shadow-2xl border border-brand-cream-dark overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image & Badges */}
        <div className="relative h-56 sm:h-64 w-full bg-brand-cream-dark shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-brand-slate flex items-center justify-center transition shadow-md"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Category */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-brand-terracotta text-white shadow-sm">
              {item.badge || item.category}
            </span>
            {item.prepTime && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-md">
                Estimasi: {item.prepTime}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-xl sm:text-2xl font-black text-brand-green leading-snug">
                {item.name}
              </h3>
              <span className="text-xl font-extrabold text-brand-terracotta shrink-0">
                Rp {item.price.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-brand-slate/80 mt-2 leading-relaxed">
              {item.description}
            </p>

            {/* Tasting notes */}
            {item.tastingNotes && item.tastingNotes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-brand-slate/60 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3 text-brand-terracotta" /> Profil Rasa:
                </span>
                {item.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-cream-dark text-brand-green font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Drink temperature choice */}
          {isDrink && item.temperature === 'Both' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-slate/80 block">
                Pilihan Suhu Minuman
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTemperature('Iced')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    temperature === 'Iced'
                      ? 'border-brand-green bg-brand-green text-white shadow-sm'
                      : 'border-brand-cream-dark bg-white text-brand-slate hover:bg-brand-cream-dark/50'
                  }`}
                >
                  <Snowflake className="w-4 h-4 text-cyan-400" />
                  Dingin / Iced
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('Hot')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    temperature === 'Hot'
                      ? 'border-brand-green bg-brand-green text-white shadow-sm'
                      : 'border-brand-cream-dark bg-white text-brand-slate hover:bg-brand-cream-dark/50'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  Hangat / Hot
                </button>
              </div>
            </div>
          )}

          {/* Sweetness selector */}
          {isDrink && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-slate/80 block">
                Tingkat Kemanisan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Normal (100%)', 'Less Sugar (50%)', 'No Sugar (0%)'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSweetness(s)}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium text-center transition ${
                      sweetness === s
                        ? 'border-brand-terracotta bg-brand-terracotta text-white shadow-sm font-semibold'
                        : 'border-brand-cream-dark bg-white text-brand-slate hover:bg-brand-cream-dark/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk customizer */}
          {hasMilkOption && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-slate/80 block">
                Pilihan Susu
              </label>
              <div className="space-y-2">
                {[
                  { id: 'Regular Milk', label: 'Fresh Milk Organik (Standard)', extra: 0 },
                  { id: 'Oat Milk (+Rp 6.000)', label: 'Oat Milk Plant-Based (Oatside)', extra: 6000 },
                  { id: 'Almond Milk (+Rp 7.000)', label: 'Almond Milk Krimi', extra: 7000 }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMilk(m.id as any)}
                    className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between text-left transition ${
                      milk === m.id
                        ? 'border-brand-green bg-brand-sage-pale text-brand-green font-semibold'
                        : 'border-brand-cream-dark bg-white text-brand-slate hover:bg-brand-cream-dark/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        milk === m.id ? 'border-brand-green bg-brand-green text-white' : 'border-gray-300'
                      }`}>
                        {milk === m.id && <Check className="w-2.5 h-2.5" />}
                      </span>
                      {m.label}
                    </span>
                    {m.extra > 0 && (
                      <span className="text-brand-terracotta font-semibold">
                        +Rp {m.extra.toLocaleString('id-ID')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-slate/80 block">
              Catatan Khusus Barista / Dapur
            </label>
            <input
              type="text"
              placeholder="cth: Pisahkan saus, less ice, atau tanpa foam"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-white focus:outline-none focus:border-brand-green text-brand-slate"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-brand-cream-dark bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-xl border border-brand-cream-dark flex items-center justify-center text-brand-slate hover:bg-brand-cream-dark disabled:opacity-40 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-bold text-brand-green w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-xl border border-brand-cream-dark flex items-center justify-center text-brand-slate hover:bg-brand-cream-dark transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-5 bg-brand-green hover:bg-brand-green-light text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-between transition shadow-md"
          >
            <span>+ Tambahkan Pesanan</span>
            <span className="font-bold text-amber-200">
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
