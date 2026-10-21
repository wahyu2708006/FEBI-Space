import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem, OrderCustomization } from '../types/index.ts';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, customization?: OrderCustomization, quantity?: number) => void;
  updateQty: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  activeModalItem: MenuItem | null;
  setActiveModalItem: (item: MenuItem | null) => void;
  activeTrackingId: string | null;
  setActiveTrackingId: (id: string | null) => void;
  recentOrders: string[];
  addRecentOrder: (orderId: string) => void;
  toast: ToastData | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('febi_space_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('febi_recent_orders');
      return saved ? JSON.parse(saved) : ['FEB-782194'];
    } catch {
      return ['FEB-782194'];
    }
  });
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('febi_space_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('febi_recent_orders', JSON.stringify(recentOrders));
    } catch (e) {
      console.error(e);
    }
  }, [recentOrders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const addRecentOrder = (orderId: string) => {
    setRecentOrders((prev) => {
      const filtered = prev.filter((id) => id !== orderId);
      return [orderId, ...filtered].slice(0, 5);
    });
  };

  const addToCart = (
    item: MenuItem,
    customization: OrderCustomization = {},
    quantity = 1
  ) => {
    // Calculate milk extra if selected
    let extraPrice = 0;
    if (customization.milk?.includes('Oat Milk')) extraPrice += 6000;
    if (customization.milk?.includes('Almond Milk')) extraPrice += 7000;

    const unitPrice = item.price + extraPrice;
    const tempKey = customization.temperature || (item.temperature === 'Iced' ? 'Iced' : 'Hot');
    const sweetKey = customization.sweetness || 'Normal (100%)';
    const milkKey = customization.milk || 'Regular Milk';
    const noteKey = customization.specialInstructions?.trim() || '';

    // Generate unique composite key
    const cartItemId = `${item.id}-${tempKey}-${sweetKey}-${milkKey}-${noteKey}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const existing = next[existingIndex];
        const newQty = existing.quantity + quantity;
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * existing.itemPrice
        };
        return next;
      }

      const newItem: CartItem = {
        cartItemId,
        menuItem: item,
        quantity,
        customization: {
          temperature: tempKey as 'Iced' | 'Hot',
          sweetness: sweetKey as any,
          milk: milkKey as any,
          specialInstructions: noteKey
        },
        itemPrice: unitPrice,
        totalPrice: unitPrice * quantity
      };

      return [...prev, newItem];
    });

    showToast(`${item.name} (${quantity}x) ditambahkan ke pesanan!`);
  };

  const updateQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.itemPrice
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item dihapus dari pesanan.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        activeModalItem,
        setActiveModalItem,
        activeTrackingId,
        setActiveTrackingId,
        recentOrders,
        addRecentOrder,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
