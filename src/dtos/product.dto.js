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
  originalPrice = price,
  discountPrice = null,
  compareAtPrice = null,
  discountPercent = 0,
  onSale = false,
  rating = 0,
  reviewCount = 0,
  stock = 0,
  colors = [],
  sizes = [],
  images = [],
  imageUrl = "",
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
  originalPrice,
  discountPrice,
  compareAtPrice,
  discountPercent,
  onSale,
  rating,
  reviewCount,
  stock,
  colors,
  sizes,
  images,
  imageUrl: imageUrl || images[0] || "",
  status,
  createdAt,
});
