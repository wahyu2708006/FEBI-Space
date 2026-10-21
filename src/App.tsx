/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ItemDetailModal } from './components/ItemDetailModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderTrackerModal } from './components/OrderTrackerModal.tsx';
import { Toast } from './components/Toast.tsx';
import { Home } from './pages/Home.tsx';
import { Menu } from './pages/Menu.tsx';
import { AboutContact } from './pages/AboutContact.tsx';
import { TrackOrderPage } from './pages/TrackOrderPage.tsx';

function MainApp() {
  const [activePage, setActivePage] = useState<string>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { activeModalItem, setActiveModalItem, activeTrackingId, setActiveTrackingId } = useCart();

  const handlePageChange = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2C3830] selection:bg-brand-terracotta selection:text-white font-sans antialiased">
      {/* Sticky Header */}
      <Navbar activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && <Home setActivePage={handlePageChange} />}
        {activePage === 'menu' && <Menu />}
        {activePage === 'about' && <AboutContact />}
        {activePage === 'track' && <TrackOrderPage setActivePage={handlePageChange} />}
      </main>

      {/* Slide-in Shopping Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Item Customization Modal (Milk, Sugar, Temperature, Notes) */}
      <ItemDetailModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(createdOrder) => {
          setActiveTrackingId(createdOrder.id);
          setActivePage('track');
        }}
      />

      {/* Quick Order Tracker Modal (if opened via top banner or quick link) */}
      {activePage !== 'track' && activeTrackingId && (
        <OrderTrackerModal
          orderId={activeTrackingId}
          onClose={() => setActiveTrackingId(null)}
        />
      )}

      {/* Delightful Toast Alerts */}
      <Toast />

      {/* Warm Earthy Footer */}
      <Footer setActivePage={handlePageChange} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
