import React, { useState } from 'react';
import { ShoppingBag, Coffee, Sparkles, Menu as MenuIcon, X, Clock, MapPin, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Logo } from './Logo.tsx';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { totalItems, setIsCartOpen, activeTrackingId, setActiveTrackingId, recentOrders } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'menu', label: 'Katalog Menu' },
    { id: 'track', label: 'Lacak Pesanan' },
    { id: 'about', label: 'Cerita & Kontak' }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/90 backdrop-blur-md border-b border-brand-cream-dark transition-all">
      {/* Top Banner Notice */}
      <div className="bg-brand-green text-white text-[11px] py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta inline-block"></span>
        <span>Buka Setiap Hari: 08.00 – 23.00 WIB • Gratis Ongkir Pesan Antar radius 3 km!</span>
        {recentOrders.length > 0 && (
          <button
            onClick={() => {
              setActiveTrackingId(recentOrders[0]);
            }}
            className="hidden sm:inline-flex items-center gap-1 underline text-amber-200 hover:text-white ml-2 cursor-pointer"
          >
            Pesanan Terakhir: {recentOrders[0]}
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left focus:outline-none transition-transform active:scale-95"
          aria-label="FEBI Space Beranda"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                  isActive
                    ? 'text-brand-terracotta'
                    : 'text-brand-slate hover:text-brand-green'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-terracotta rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Order Online Quick CTA button */}
          <button
            onClick={() => handleNavClick('menu')}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-brand-green bg-brand-sage-pale hover:bg-brand-cream-dark transition border border-brand-sage-light"
          >
            <Coffee className="w-4 h-4 text-brand-terracotta" />
            <span>Pesan Online</span>
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-2xl bg-brand-green text-white hover:bg-brand-green-light transition shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Buka Keranjang Pesanan"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-terracotta text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-brand-slate hover:bg-brand-cream-dark transition"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-cream-dark px-6 py-5 space-y-3 animate-fade-in shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold transition ${
                activePage === link.id
                  ? 'bg-brand-sage-pale text-brand-green'
                  : 'text-brand-slate hover:bg-brand-cream'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => handleNavClick('menu')}
              className="flex-1 py-2.5 bg-brand-terracotta text-white rounded-xl text-xs font-bold text-center"
            >
              Katalog Menu & Pesan
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
