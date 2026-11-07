import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subtotal, total } from '../../src/cart.js';

test('subtotal sums price * qty', () => {
  assert.equal(subtotal([{ sku: 'A', price: 250, qty: 2 }, { sku: 'B', price: 100, qty: 1 }]), 600);
});

test('subtotal of empty cart is 0', () => {
  assert.equal(subtotal([]), 0);
});

test('total without a discount equals subtotal', () => {
  assert.equal(total({ items: [{ sku: 'A', price: 999, qty: 1 }] }), 999);
});
