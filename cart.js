// ── D-QueenCart Cart Utility ──────────────────────────────────
// Per-user cart: each user gets their own isolated cart
// Key format: dqueencart_cart_{uid} (or dqueencart_cart_guest for unauthenticated)

window.DQueenCartUtil = {
  key() {
    const user = JSON.parse(localStorage.getItem('dqueencart_user') || 'null');
    return (user && user.uid && user.uid !== '') ? 'dqueencart_cart_' + user.uid : 'dqueencart_cart_guest';
  },
  get()  { return JSON.parse(localStorage.getItem(this.key()) || '[]'); },
  save(c) { localStorage.setItem(this.key(), JSON.stringify(c)); },
  count() { return this.get().reduce((a, i) => a + i.qty, 0); },
  total() { return this.get().reduce((a, i) => a + i.price * i.qty, 0); },
  add(product) {
    const c = this.get();
    const ex = c.find(i => String(i.id) === String(product.id));
    const stock = Number(product.stock) || 0;
    
    if (ex) {
      if (ex.qty < stock) {
        ex.qty++;
        this.save(c);
        return { success: true, msg: 'Added to cart ✓' };
      } else {
        return { success: false, msg: 'Maximum stock reached!' };
      }
    } else {
      if (stock > 0) {
        c.push({ ...product, qty: 1 });
        this.save(c);
        return { success: true, msg: 'Added to cart ✓' };
      } else {
        return { success: false, msg: 'Item is out of stock!' };
      }
    }
  },
  remove(id) {
    this.save(this.get().filter(i => String(i.id) !== String(id)));
  },
  clear() { localStorage.removeItem(this.key()); },

  // Call this after login to merge any guest items into the user's cart
  migrateGuestCart(uid) {
    if (!uid) return;
    const guestKey = 'dqueencart_cart_guest';
    const guestCart = JSON.parse(localStorage.getItem(guestKey) || '[]');
    if (!guestCart.length) return;
    const userKey = 'dqueencart_cart_' + uid;
    const userCart = JSON.parse(localStorage.getItem(userKey) || '[]');
    guestCart.forEach(item => {
      const ex = userCart.find(i => String(i.id) === String(item.id));
      if (ex) ex.qty += item.qty;
      else userCart.push(item);
    });
    localStorage.setItem(userKey, JSON.stringify(userCart));
    localStorage.removeItem(guestKey);
  }
};