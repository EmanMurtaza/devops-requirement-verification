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

const CODES = {
  SAVE10: { percent: 10, minSubtotal: 5000 },
  EXPIRED20: { percent: 20, expiresAt: new Date('2025-12-31T23:59:59Z') },
};

/**
 * PROJ-123: apply a discount code.
 * @returns {{ok: true, total: number, discount: number} | {ok: false, reason: string, total: number}}
 */
export function applyDiscount(cart, rawCode, now = new Date()) {
  const base = subtotal(cart.items);
  const reject = (reason) => ({ ok: false, reason, total: base });

  if (cart.discountCode) return reject('ALREADY_APPLIED');

  const rule = CODES[String(rawCode).trim().toUpperCase()];
  if (!rule) return reject('INVALID_CODE');
  if (rule.expiresAt && now > rule.expiresAt) return reject('EXPIRED_CODE');
  if (rule.minSubtotal && base < rule.minSubtotal) return reject('MIN_SUBTOTAL');

  const discount = Math.round((base * rule.percent) / 100);
  return { ok: true, total: base - discount, discount };
}
