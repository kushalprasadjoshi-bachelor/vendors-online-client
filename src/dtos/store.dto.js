import { slugify } from "../utils/slug";

const normalizeId = (value) =>
  value && typeof value === "object" && typeof value.toString === "function"
    ? value.toString()
    : String(value ?? "");

export const createStoreDto = ({
  id = "",
  name = "",
  ownerId = "",
  slug = "",
  city = "",
  country = "Nepal",
  description = "",
  rating = 0,
  reviewCount = 0,
  imageUrl = "",
  bannerUrl = "",
  categories = [],
  status = "active",
  createdAt = new Date().toISOString(),
} = {}) => ({
  id: normalizeId(id),
  name: name.trim(),
  ownerId: normalizeId(ownerId),
  slug: normalizeId(slug || slugify(name)),
  city,
  country,
  description,
  rating,
  reviewCount,
  imageUrl,
  bannerUrl,
  categories,
  status,
  createdAt,
});
