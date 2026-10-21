import React from 'react';
import { Logo } from './Logo.tsx';
import { MapPin, Phone, Mail, Clock, Instagram, Send, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-brand-green text-[#FAF8F4] mt-24 border-t border-brand-green-light">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-brand-sage via-brand-terracotta to-brand-green-light" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-xs text-[#FAF8F4]/75 leading-relaxed mt-2">
              Ruang kolaboratif ramah ide yang memadukan sajian artisan kopi spesialti Indonesia dengan ekosistem kreatif yang hangat dan produktif.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-terracotta text-white flex items-center justify-center transition"
                aria-label="Instagram FEBI Space"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/6281288997700"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition"
                aria-label="WhatsApp FEBI Space"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:halo@febispace.id"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-terracotta text-white flex items-center justify-center transition"
                aria-label="Email FEBI Space"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
              Jelajahi Ruang
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F4]/80">
              <li>
                <button
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-terracotta transition"
                >
                  Beranda & Filosofi
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-terracotta transition"
                >
                  Katalog Menu Lengkap
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('track'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-terracotta transition"
                >
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-terracotta transition"
                >
                  Cerita Brand & Lokasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('about'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}
                  className="hover:text-brand-terracotta transition flex items-center gap-1"
                >
                  <span>Reservasi Workshop / Kolaborasi</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hours & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
              Lokasi & Jam Temu
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF8F4]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
                <span>
                  Jl. Cendekia Kreasi No. 24, Kawasan Kreatif Terpadu, Jakarta Selatan 12430
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Senin – Jumat: 08.00 – 22.00 WIB</p>
                  <p className="text-[#FAF8F4]/70 mt-0.5">Sabtu – Minggu: 07.30 – 23.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter / Bulletin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
              Warta Kreatif FEBI
            </h4>
            <p className="text-xs text-[#FAF8F4]/75 leading-relaxed">
              Dapatkan jadwal pameran mingguan, rilisan beans seasonal, dan diskon komunitas.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Terima kasih telah berlangganan Warta Kreatif FEBI Space!');
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Alamat email Anda..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-brand-terracotta"
              />
              <button
                type="submit"
                className="p-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white rounded-xl transition shrink-0"
                aria-label="Kirim Langganan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F4]/60">
          <p>© {new Date().getFullYear()} FEBI Space. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-1">
            <span>Diseduh dengan cinta & inspirasi</span>
            <Heart className="w-3.5 h-3.5 text-brand-terracotta fill-current" />
            <span>untuk komunitas kreatif Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
