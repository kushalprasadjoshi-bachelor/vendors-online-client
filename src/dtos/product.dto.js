import { slugify } from "../utils/slug";

const normalizeId = (value) =>
  value && typeof value === "object" && typeof value.toString === "function"
    ? value.toString()
    : String(value ?? "");

export const createProductDto = ({
  id = "",
  storeId = "",
  storeSlug = "",
  name = "",
  slug = "",
  category = "",
  description = "",
  price = 0,
  compareAtPrice = null,
  discountPercent = 0,
  rating = 0,
  reviewCount = 0,
  stock = 0,
  colors = [],
  sizes = [],
  images = [],
  status = "active",
  createdAt = new Date().toISOString(),
} = {}) => ({
  id: normalizeId(id),
  storeId: normalizeId(storeId),
  storeSlug: normalizeId(storeSlug),
  name: name.trim(),
  slug: normalizeId(slug || slugify(name)),
  category,
  description,
  price,
  compareAtPrice,
  discountPercent,
  rating,
  reviewCount,
  stock,
  colors,
  sizes,
  images,
  status,
  createdAt,
});
