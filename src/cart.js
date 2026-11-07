// Tiny sample "product code". Prices are integer cents to avoid float errors.

/** @typedef {{ sku: string, price: number, qty: number }} Item */
/** @typedef {{ items: Item[], discountCode?: string }} Cart */

/** Sum of price * qty, in cents. */
export function subtotal(items) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

/** Amount payable for a cart, in cents. */
export function total(cart) {
  return subtotal(cart.items);
}
