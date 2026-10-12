// @module frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isCartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'customer') { setCartItems([]); setSubtotal(0); return; }
    setLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCartItems(data.data.items || []);
      setSubtotal(Number(data.data.subtotal || 0));
    } finally { setLoading(false); }
  }, [isAuthenticated, user?.role]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (productId, qty = 1) => {
    await cartAPI.add({ product_id: productId, quantity: qty });
    await fetchCart();
    setCartOpen(true);
  }, [fetchCart]);
  const updateQty = useCallback(async (cartId, qty) => { await cartAPI.update(cartId, qty); await fetchCart(); }, [fetchCart]);
  const removeItem = useCallback(async (cartId) => { await cartAPI.remove(cartId); await fetchCart(); }, [fetchCart]);
  const clearCart = useCallback(() => { setCartItems([]); setSubtotal(0); }, []);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.quantity), 0), [cartItems]);

  const value = useMemo(() => ({ cartItems, cartCount, subtotal, loading, addToCart, updateQty, removeItem, clearCart, fetchCart, isCartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false) }), [cartItems, cartCount, subtotal, loading, addToCart, updateQty, removeItem, clearCart, fetchCart, isCartOpen]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider.');
  return context;
}
