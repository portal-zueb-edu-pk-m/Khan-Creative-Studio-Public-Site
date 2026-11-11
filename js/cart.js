/**
 * Khan Creative Studio — Public Cart Manager
 */

const CART_KEY = 'kcs_public_cart';

export const cart = {
  getItems() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  },

  addItem(item) {
    const items = this.getItems();
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      items[existingIndex].quantity = (items[existingIndex].quantity || 1) + 1;
    } else {
      items.push({
        id: item.id,
        name: item.name || item.title,
        price: Number(item.price || item.discount_price || item.starting_price || 0),
        tier: item.tier || 'Standard',
        type: item.type || 'package',
        quantity: 1
      });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: this.getCount() } }));
  },

  removeItem(id) {
    let items = this.getItems();
    items = items.filter(i => i.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: this.getCount() } }));
  },

  updateQuantity(id, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      if (qty <= 0) {
        this.removeItem(id);
        return;
      }
      item.quantity = qty;
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: this.getCount() } }));
    }
  },

  clear() {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: 0 } }));
  },

  getCount() {
    return this.getItems().reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getSubtotal() {
    return this.getItems().reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }
};
