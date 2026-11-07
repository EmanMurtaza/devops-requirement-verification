// PROJ-123: Apply a discount code at checkout.
// Written by QA BEFORE development. Fails until the feature is built.
//
// Contract the dev implements in src/cart.js:
//   applyDiscount(cart, code, now = new Date())
//     -> { ok: true,  total, discount }         on success
//     -> { ok: false, reason, total }           on rejection
//   Money is integer cents. Cart = { items: [{sku, price, qty}], discountCode? }.
//
// Codes (from the ticket):  SAVE10    = 10% off, needs subtotal >= $50.00
//                           EXPIRED20 = 20% off, expired 2025-12-31
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as cart from '../src/cart.js';

const NOW = new Date('2026-11-07T12:00:00Z');
const cartOf = (priceCents, extra = {}) => ({ items: [{ sku: 'A', price: priceCents, qty: 1 }], ...extra });

function apply(c, code) {
  assert.equal(
    typeof cart.applyDiscount,
    'function',
    'PROJ-123: cart.applyDiscount(cart, code, now) is not implemented yet'
  );
  return cart.applyDiscount(c, code, NOW);
}

describe('PROJ-123 Apply a discount code', () => {
  test('AC1: Given subtotal $100.00, When SAVE10 is applied, Then total is $90.00 and discount $10.00', () => {
    const r = apply(cartOf(10000), 'SAVE10');
    assert.deepEqual(r, { ok: true, total: 9000, discount: 1000 });
  });

  test('AC1b: Given subtotal exactly $50.00, When SAVE10 is applied, Then it is accepted (boundary)', () => {
    const r = apply(cartOf(5000), 'SAVE10');
    assert.equal(r.ok, true);
    assert.equal(r.total, 4500);
  });

  test('AC2: Given subtotal $49.99, When SAVE10 is applied, Then it is rejected with MIN_SUBTOTAL and total unchanged', () => {
    const r = apply(cartOf(4999), 'SAVE10');
    assert.deepEqual(r, { ok: false, reason: 'MIN_SUBTOTAL', total: 4999 });
  });

  test('AC3: Given code typed as "  save10 ", When applied, Then it works (case-insensitive, trimmed)', () => {
    const r = apply(cartOf(10000), '  save10 ');
    assert.equal(r.ok, true);
    assert.equal(r.total, 9000);
  });

  test('AC4: Given an unknown code, When applied, Then it is rejected with INVALID_CODE and total unchanged', () => {
    const r = apply(cartOf(10000), 'FREEMONEY');
    assert.deepEqual(r, { ok: false, reason: 'INVALID_CODE', total: 10000 });
  });

  test('AC5: Given an expired code, When applied, Then it is rejected with EXPIRED_CODE and total unchanged', () => {
    const r = apply(cartOf(10000), 'EXPIRED20');
    assert.deepEqual(r, { ok: false, reason: 'EXPIRED_CODE', total: 10000 });
  });

  test('AC6: Given a cart that already has a code, When another code is applied, Then it is rejected with ALREADY_APPLIED', () => {
    const r = apply(cartOf(10000, { discountCode: 'SAVE10' }), 'SAVE10');
    assert.equal(r.ok, false);
    assert.equal(r.reason, 'ALREADY_APPLIED');
  });

  test('AC7: Given a discount that is not a whole cent, When applied, Then the discount rounds half up to the cent', () => {
    // 10% of $50.05 = 500.5 cents -> discount rounds to 501, total 4504
    const r = apply(cartOf(5005), 'SAVE10');
    assert.deepEqual(r, { ok: true, total: 4504, discount: 501 });
  });
});
