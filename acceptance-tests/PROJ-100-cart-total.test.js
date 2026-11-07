// Baseline acceptance test for an already-shipped feature (PROJ-100).
// Shows the format QA uses: one test per acceptance criterion, named Given/When/Then.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { total } from '../src/cart.js';

describe('PROJ-100 Cart total', () => {
  test('AC1: Given a cart with two items, When total is requested, Then it is the sum of price x qty', () => {
    const cart = { items: [{ sku: 'A', price: 1000, qty: 2 }, { sku: 'B', price: 500, qty: 1 }] };
    assert.equal(total(cart), 2500);
  });

  test('AC2: Given an empty cart, When total is requested, Then it is zero', () => {
    assert.equal(total({ items: [] }), 0);
  });
});
