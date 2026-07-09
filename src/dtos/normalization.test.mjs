import test from "node:test";
import assert from "node:assert/strict";
import { createStoreDto } from "./store.dto.js";
import { createProductDto } from "./product.dto.js";

test("normalizes ids and slugs to strings for frontend routing", () => {
  const store = createStoreDto({
    id: { toString: () => "store_123" },
    ownerId: { toString: () => "vendor_123" },
    slug: { toString: () => "store_123" },
    name: "Demo Store",
  });

  assert.equal(typeof store.id, "string");
  assert.equal(store.id, "store_123");
  assert.equal(typeof store.ownerId, "string");
  assert.equal(store.ownerId, "vendor_123");
  assert.equal(typeof store.slug, "string");
  assert.equal(store.slug, "store_123");

  const product = createProductDto({
    id: { toString: () => "product_123" },
    storeId: { toString: () => "store_123" },
    storeSlug: { toString: () => "store_123" },
    slug: { toString: () => "product_123" },
    name: "Demo Product",
  });

  assert.equal(typeof product.id, "string");
  assert.equal(product.id, "product_123");
  assert.equal(typeof product.storeId, "string");
  assert.equal(product.storeId, "store_123");
  assert.equal(typeof product.storeSlug, "string");
  assert.equal(product.storeSlug, "store_123");
  assert.equal(typeof product.slug, "string");
  assert.equal(product.slug, "product_123");
});
