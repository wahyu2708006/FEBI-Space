import React, { useState, useEffect } from 'react';
import { Search, Plus, Sparkles, Filter, Coffee, SlidersHorizontal, Check, ArrowRight } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { INITIAL_MENU_ITEMS } from '../data/mockData.ts';

export const Menu: React.FC = () => {
  const { addToCart, setActiveModalItem, setIsCartOpen, totalItems, subtotal } = useCart();

  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setItems(data.data);
        } else {
          setItems(INITIAL_MENU_ITEMS);
        }
      })
      .catch(() => {
        setItems(INITIAL_MENU_ITEMS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories: { id: MenuCategory; label: string; count?: number }[] = [
    { id: 'All', label: 'Semua Menu' },
    { id: 'Coffee', label: 'Coffee & Espresso' },
    { id: 'Non-Coffee', label: 'Non-Coffee & Tea' },
    { id: 'Food', label: 'Artisan Food & Brunch' },
    { id: 'Pastry', label: 'Pastry & Dessert' }
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.tastingNotes && item.tastingNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesFeatured = !onlyFeatured || item.featured;

    return matchesCat && matchesSearch && matchesFeatured;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
          Katalog Lengkap Rasa & Nutrisi
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-brand-green">
          Pilihan Menu FEBI Space
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate/80 leading-relaxed">
          Temukan racikan kopi spesialti, racikan herbal segar, sarapan bernutrisi, hingga pastry mentega Prancis yang dipanggang setiap hari.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-brand-cream-dark shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-2xl whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'bg-brand-cream border border-brand-cream-dark text-brand-slate hover:bg-brand-cream-dark/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate/40" />
            <input
              type="text"
              placeholder="Cari kopi, matcha, pastry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-brand-cream-dark bg-brand-cream/40 focus:outline-none focus:border-brand-green text-brand-slate placeholder-brand-slate/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-slate/40 hover:text-brand-slate"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition ${
                onlyFeatured
                  ? 'border-brand-terracotta bg-amber-50 text-brand-terracotta'
                  : 'border-brand-cream-dark bg-white text-brand-slate/70 hover:bg-brand-cream'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hanya Menu Unggulan</span>
            </button>
          </div>

          <span className="text-[11px] text-brand-slate/60">
            Menampilkan <strong className="text-brand-green">{filteredItems.length}</strong> pilihan sajian
          </span>
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-cream-dark p-8 space-y-4">
          <Coffee className="w-12 h-12 text-brand-slate/30 mx-auto" />
          <h3 className="text-lg font-bold text-brand-green">Menu Tidak Ditemukan</h3>
          <p className="text-xs text-brand-slate/60 max-w-sm mx-auto">
            Tidak ada sajian yang cocok dengan kata kunci "{searchQuery}" pada kategori ini.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setOnlyFeatured(false);
            }}
            className="px-5 py-2.5 bg-brand-green text-white text-xs font-semibold rounded-xl hover:bg-brand-green-light transition"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-brand-cream-dark shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Cover */}
                <div className="aspect-[4/3] overflow-hidden relative bg-brand-cream-dark">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-brand-green uppercase tracking-wider shadow-xs">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="bg-brand-terracotta text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.prepTime && (
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white">
                      {item.prepTime}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-brand-green leading-snug group-hover:text-brand-terracotta transition">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-slate/75 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tasting notes */}
                  {item.tastingNotes && item.tastingNotes.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-brand-cream-dark text-brand-slate font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 sm:p-6 pt-0 border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-slate/50 uppercase tracking-wider block font-semibold">
                    Harga
                  </span>
                  <span className="text-base font-black text-brand-terracotta">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="px-3 py-2 border border-brand-cream-dark hover:bg-brand-cream-dark text-brand-slate text-xs font-semibold rounded-xl transition"
                    title="Sesuaikan susu, kemanisan, suhu"
                  >
                    Kustomisasi
                  </button>
                  <button
                    onClick={() => {
                      addToCart(item);
                      setIsCartOpen(true);
                    }}
                    className="px-4 py-2 bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pesan</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Quick Checkout Floater if cart has items */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-bounce-short">
          <div className="bg-brand-green text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-brand-terracotta">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-terracotta text-white flex items-center justify-center font-bold text-xs">
                {totalItems}
              </span>
              <div>
                <p className="text-xs font-bold leading-tight">Keranjang Anda</p>
                <p className="text-xs text-amber-200 font-bold">
                  Rp {subtotal.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-white text-brand-green hover:bg-brand-cream text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Lihat & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
