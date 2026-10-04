import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems]         = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartOpen, setCartOpen]           = useState(false);
  const [toastMsg, setToastMsg]           = useState('');
  const { user } = useAuth();
  const syncTimerRef = useRef(null);
  const prevUserRef  = useRef(null);

  /* ── Toast helper ── */
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  }, []);

  /* ── CART ── */
  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`🛒 "${product.name}" added to cart!`);
    setCartOpen(true);
  }, [showToast]);

  const removeFromCart   = useCallback((id)    => setCartItems(prev => prev.filter(i => i.id !== id)), []);
  const updateQty        = useCallback((id, d) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0)), []);
  const clearCart        = useCallback(()      => setCartItems([]), []);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const isInCart  = useCallback((id) => cartItems.some(i => i.id === id), [cartItems]);

  /* ── Cloud wishlist helpers ── */
  const getToken = useCallback(async () => {
    if (!user?.getIdToken) return null;
    try { return await user.getIdToken(); } catch { return null; }
  }, [user]);

  const saveWishlistToCloud = useCallback(async (items) => {
    const token = await getToken();
    if (!token) return;
    try {
      await axios.put('/api/wishlist',
        { wishlist: items.map(i => i.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) { console.log('Wishlist save skipped', e.message); }
  }, [getToken]);

  /* On login: load cloud wishlist and merge with local */
  useEffect(() => {
    const loggedIn  = !!user;
    const wasLoggedIn = !!prevUserRef.current;
    prevUserRef.current = user;

    if (!loggedIn || wasLoggedIn) return; // only on fresh login

    (async () => {
      const token = await getToken();
      if (!token) return;
      try {
        const res = await axios.get('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } });
        const cloudIds = res.data.wishlist || [];
        if (cloudIds.length === 0) return;

        // Fetch product details for cloud IDs we don't have locally
        const allProducts = window.__fortuneProducts || [];
        setWishlistItems(prev => {
          const merged = [...prev];
          for (const id of cloudIds) {
            if (!merged.some(x => x.id === id)) {
              const p = allProducts.find(x => x.id === id);
              if (p) merged.push(p);
            }
          }
          return merged;
        });
      } catch (e) { console.log('Wishlist load skipped', e.message); }
    })();
  }, [user, getToken]);

  /* Debounced auto-save when logged in and wishlist changes */
  useEffect(() => {
    if (!user) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => saveWishlistToCloud(wishlistItems), 1200);
    return () => { if (syncTimerRef.current) clearTimeout(syncTimerRef.current); };
  }, [wishlistItems, user, saveWishlistToCloud]);

  /* ── WISHLIST ── */
  const toggleWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      const has = prev.some(i => i.id === product.id);
      if (has) { showToast(`💔 Removed from wishlist`); return prev.filter(i => i.id !== product.id); }
      showToast(`❤️ "${product.name}" saved to wishlist!`);
      return [...prev, product];
    });
  }, [showToast]);

  const isWishlisted       = useCallback((id) => wishlistItems.some(i => i.id === id), [wishlistItems]);
  const removeFromWishlist = useCallback((id) => setWishlistItems(prev => prev.filter(i => i.id !== id)), []);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQty, clearCart, isInCart,
      wishlistItems, toggleWishlist, isWishlisted, removeFromWishlist,
      toastMsg, showToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
