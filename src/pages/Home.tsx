import React, { useState, useEffect } from 'react';
import { ArrowRight, Coffee, Lightbulb, Compass, Star, Sparkles, Check, Clock, MapPin, ChevronRight } from 'lucide-react';
import { MenuItem, Testimonial } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { INITIAL_MENU_ITEMS, INITIAL_TESTIMONIALS } from '../data/mockData.ts';

interface HomeProps {
  setActivePage: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActivePage }) => {
  const { setActiveModalItem, addToCart, setIsCartOpen } = useCart();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  useEffect(() => {
    fetch('/api/menu?featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setFeaturedItems(data.data.slice(0, 4));
        } else {
          setFeaturedItems(INITIAL_MENU_ITEMS.filter((i) => i.featured).slice(0, 4));
        }
      })
      .catch(() => {
        setFeaturedItems(INITIAL_MENU_ITEMS.filter((i) => i.featured).slice(0, 4));
      });

    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setTestimonials(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-sage-pale/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-terracotta-light/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-cream-dark text-xs font-semibold text-brand-green shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-pulse"></span>
              <span>Ruang Eksplorasi Kopi & Gagasan Kreatif</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-green leading-[1.12] tracking-tight">
              Tempat Rasa Bertemu{' '}
              <span className="text-brand-terracotta relative inline-block">
                Inspirasi.
                <svg
                  className="absolute left-0 -bottom-2 w-full h-2.5 text-brand-terracotta/40"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0,10 Q50,0 100,10" fill="transparent" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-brand-slate/85 leading-relaxed font-normal max-w-xl">
              FEBI Space hadir sebagai perpaduan antara artisan coffee bar dan ruang kolaborasi dinamis di Jakarta Selatan. Nikmati racikan kopi lokal terkurasi untuk menyalakan percakapan, karya, dan ide-ide terbaik Anda.
            </p>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 bg-white rounded-2xl border border-brand-cream-dark shadow-xs">
                <span className="text-xs font-bold text-brand-slate/60 block">Biji Kopi</span>
                <span className="text-sm sm:text-base font-extrabold text-brand-green">100% Nusantara</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-brand-cream-dark shadow-xs">
                <span className="text-xs font-bold text-brand-slate/60 block">Fasilitas</span>
                <span className="text-sm sm:text-base font-extrabold text-brand-green">WiFi 100 Mbps</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-brand-cream-dark shadow-xs">
                <span className="text-xs font-bold text-brand-slate/60 block">Rating Ulasan</span>
                <span className="text-sm sm:text-base font-extrabold text-brand-terracotta">★ 4.9 / 5.0</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3.5 pt-3">
              <button
                onClick={() => setActivePage('menu')}
                className="px-7 py-4 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded-2xl transition shadow-lg flex items-center gap-2.5 cursor-pointer active:scale-98"
              >
                <span>Pesan Menu Favorit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('about')}
                className="px-6 py-4 border border-brand-green/30 bg-white hover:bg-brand-cream-dark text-brand-green font-semibold rounded-2xl transition cursor-pointer"
              >
                Jelajahi Cerita Brand
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Feature Photo */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
                  alt="Suasana Cafe FEBI Space"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-terracotta text-[10px] font-bold uppercase tracking-wider">
                    Suasana Harian
                  </span>
                  <p className="text-base font-bold mt-1">Artisan Coffee & Community Creative Hub</p>
                  <p className="text-xs text-[#FAF8F4]/80">Jakarta Selatan • 08.00 - 23.00 WIB</p>
                </div>
              </div>

              {/* Floating Highlight Card 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-brand-cream-dark hidden sm:flex items-center gap-3.5">
                <div className="p-3 bg-brand-sage-pale rounded-xl text-brand-green shrink-0">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-brand-slate/60 font-semibold uppercase tracking-wider">
                    Signature Blend
                  </p>
                  <p className="text-sm font-black text-brand-green">Febi Aren & Cold Brew Tangerine</p>
                </div>
              </div>

              {/* Floating Highlight Card 2 */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-brand-cream-dark hidden sm:flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-terracotta" />
                <span className="text-xs font-bold text-brand-green">Slow Bar & Workshop Room</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE PILLARS (CAFE • CREATIVE • IDEAS) */}
      <section className="bg-brand-cream-dark/50 py-16 sm:py-20 border-y border-brand-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
              Tiga Pilar Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-green">
              Lebih Dari Sekadar Secangkir Kopi
            </h2>
            <p className="text-sm text-brand-slate/75">
              Setiap sudut di FEBI Space didedikasikan untuk kenyamanan mencicipi rasa, memicu kreativitas, dan membangun relasi bermakna.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pilar 1: Cafe */}
            <div className="bg-white p-8 rounded-3xl border border-brand-cream-dark shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-green text-white flex items-center justify-center mb-6 group-hover:bg-brand-green-light transition shadow-sm">
                  <Coffee className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-green mb-3">1. Cafe & Artisan Brew</h3>
                <p className="text-sm text-brand-slate/80 leading-relaxed">
                  Biji kopi Nusantara pilihan yang disangrai dengan profil presisi. Mulai dari manual brew V60, espresso signature, hingga sajian non-kopi seperti Matcha Uji dan roti sourdough organik.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-terracotta">
                <span>Lihat Racikan Barista</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Pilar 2: Creative */}
            <div className="bg-white p-8 rounded-3xl border border-brand-cream-dark shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-terracotta text-white flex items-center justify-center mb-6 group-hover:bg-brand-terracotta-dark transition shadow-sm">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-green mb-3">2. Creative Space Hub</h3>
                <p className="text-sm text-brand-slate/80 leading-relaxed">
                  Dirancang ergonomis untuk bekerja individu maupun kolaborasi tim. Dilengkapi colokan listrik di setiap meja, kursi ergonomis, penerangan alami yang teduh, dan koneksi internet stabil.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-terracotta">
                <span>Eksplor Fasilitas</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Pilar 3: Ideas */}
            <div className="bg-white p-8 rounded-3xl border border-brand-cream-dark shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-slate text-white flex items-center justify-center mb-6 transition shadow-sm">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-green mb-3">3. Ideas & Community</h3>
                <p className="text-sm text-brand-slate/80 leading-relaxed">
                  Wadah berkumpul bagi pegiat kreatif, desainer, penulis, dan entrepreneur. Kami rutin menyelenggarakan sharing session, pameran seni mini, workshop literasi, dan peluncuran produk komunitas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-terracotta">
                <span>Ajukan Kolaborasi</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MENU SPESIAL HARI INI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
              Kurasi Pilihan Barista
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-green mt-1">
              Menu Spesial Hari Ini
            </h2>
            <p className="text-sm text-brand-slate/75 mt-1">
              Diracik segar menggunakan bahan berkualitas tinggi dan resep orisinal FEBI Space.
            </p>
          </div>
          <button
            onClick={() => setActivePage('menu')}
            className="text-xs sm:text-sm font-bold text-brand-terracotta hover:text-brand-terracotta-dark mt-4 md:mt-0 flex items-center gap-1.5 cursor-pointer"
          >
            Lihat Semua 12 Menu <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-brand-cream-dark shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative bg-brand-cream-dark">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-brand-green uppercase tracking-wider shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.prepTime && (
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white">
                      {item.prepTime}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate/60">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-brand-green mt-1 leading-snug group-hover:text-brand-terracotta transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-brand-slate/70 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-base font-black text-brand-terracotta">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="px-3 py-1.5 border border-brand-cream-dark hover:bg-brand-cream-dark text-brand-slate text-xs font-semibold rounded-xl transition"
                    title="Sesuaikan pesanan"
                  >
                    Opsi
                  </button>
                  <button
                    onClick={() => {
                      addToCart(item);
                      setIsCartOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    + Pesan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPERIENCE & AMBIANCE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-cream-dark shadow-sm grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
              Eksplorasi Ruang
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-green leading-tight">
              Kenyamanan Berkarya dari Pagi hingga Malam
            </h2>
            <p className="text-sm text-brand-slate/80 leading-relaxed">
              Kami mendesain setiap sudut dengan memperhatikan sirkulasi udara alami, pencahayaan hangat bertemperatur 3000K, tanaman hijau penyegar mata, serta playlist lo-fi dan jazz akustik yang menjaga fokus pikiran.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Slow Bar & Manual Brew', desc: 'Saksikan barista menyeduh pour-over sambil berdiskusi profil kopi nusantara.' },
                { title: 'Mezzanine Quiet Loft', desc: 'Zona sunyi untuk konsentrasi kerja, penyusunan riset, atau membaca buku.' },
                { title: 'Outdoor Green Garden', desc: 'Area terbuka hijau ramah perokok dengan semilir angin dan tanaman hias asri.' },
                { title: 'Ruang Workshop & Audio Podcast', desc: 'Dapat direservasi untuk pameran, kelas kreatif, atau rekaman audio.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-brand-sage-pale flex items-center justify-center text-brand-green shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-green">{f.title}</h4>
                    <p className="text-[11px] text-brand-slate/70">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActivePage('about')}
              className="px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Lihat Denah & Reservasi Tempat
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
              alt="FEBI Space Barista"
              className="rounded-2xl object-cover h-48 w-full shadow-xs"
            />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
              alt="Community working"
              className="rounded-2xl object-cover h-48 w-full shadow-xs mt-6"
            />
            <img
              src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80"
              alt="Artisan brew"
              className="rounded-2xl object-cover h-48 w-full shadow-xs"
            />
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
              alt="FEBI Space interior"
              className="rounded-2xl object-cover h-48 w-full shadow-xs mt-6"
            />
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="bg-brand-green text-[#FAF8F4] py-20 rounded-3xl mx-4 sm:mx-6 max-w-7xl xl:mx-auto px-6 sm:px-12 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
            Cerita Pengunjung
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Suara dari Komunitas FEBI Space
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF8F4]/75">
            Pengalaman nyata para desainer, penulis, kreator konten, dan penikmat kopi yang menjadikan FEBI Space sebagai basecamp berkarya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-brand-green-light/70 p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs italic leading-relaxed text-[#FAF8F4]/90">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-brand-terracotta/50"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{t.name}</p>
                  <p className="text-[10px] text-brand-terracotta truncate">{t.role}</p>
                  <p className="text-[9px] text-[#FAF8F4]/60 mt-0.5 truncate">
                    Favorit: {t.favoriteItem}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-brand-terracotta via-[#C2753F] to-brand-terracotta rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Lapar atau Haus Saat Bekerja?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Pesan Menu Favorit Anda Langsung ke Meja
            </h3>
            <p className="text-xs sm:text-sm text-white/90">
              Bisa pesan untuk dine-in tanpa antre di kasir, bungkus takeaway, atau kirim langsung ke alamat kantor Anda di area sekitar kafe.
            </p>
          </div>
          <button
            onClick={() => setActivePage('menu')}
            className="px-8 py-4 bg-brand-green hover:bg-brand-green-light text-white font-black text-sm rounded-2xl shadow-lg transition shrink-0 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Buka Katalog Menu Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
