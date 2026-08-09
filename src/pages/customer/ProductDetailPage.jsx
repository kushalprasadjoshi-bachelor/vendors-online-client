import { CheckCircle, Minus, Plus, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ProductCard from "../../components/common/ProductCard";
import SectionHeader from "../../components/common/SectionHeader";
import FAQ from "../../components/common/FAQ";
import Stars from "../../components/common/Stars";
import { routes, storePath } from "../../config/routes";
import { useAuth } from "../../plugins/authContext";
import { useCart } from "../../plugins/cartContext";
import { useToast } from "../../plugins/toastContext";
import { catalogService } from "../../services/catalogService";
import { currency, dateLabel } from "../../utils/formatters";

const averageRating = (reviews) =>
  reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length
    : 0;

const ProductDetailPage = () => {
  const { storeSlug, productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [image, setImage] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const refreshReviews = async (productId) => {
    const reviews = await catalogService.getProductReviews(productId);
    setProductReviews(reviews);
    setProduct((current) =>
      current
        ? {
            ...current,
            rating: averageRating(reviews),
            reviewCount: reviews.length,
          }
        : current,
    );
  };

  useEffect(() => {
    if (productSlug && storeSlug) {
      catalogService
        .getProductBySlug(productSlug)
        .then((prod) => {
          setProduct(prod);
          setImage(prod.images[0] || prod.imageUrl || "");

          const colorsList =
            prod.colors && prod.colors.length
              ? prod.colors
              : ["#000000", "#333333", "#EF4444"];
          const sizesList =
            prod.sizes && prod.sizes.length
              ? prod.sizes
              : ["S", "M", "L", "XL"];
          setColor(colorsList[0]);
          setSize(sizesList[1] || sizesList[0]);

          refreshReviews(prod.id).catch(console.error);

          catalogService
            .getProducts()
            .then((allProds) => {
              setRelated(
                allProds.filter((item) => item.id !== prod.id).slice(0, 4),
              );
            })
            .catch(console.error);
        })
        .catch(console.error);

      catalogService
        .getStoreBySlug(storeSlug)
        .then(setStore)
        .catch(console.error);
    }
  }, [productSlug, storeSlug]);

  const discountLabel = useMemo(() => {
    if (!product || !product.discountPercent) return null;
    return `-${product.discountPercent}%`;
  }, [product]);

  const nextImage = () => {
    if (!product || !product.images || product.images.length === 0) return;
    const idx = product.images.indexOf(image);
    const next = idx === -1 || idx === product.images.length - 1 ? 0 : idx + 1;
    setImage(product.images[next]);
  };

  const prevImage = () => {
    if (!product || !product.images || product.images.length === 0) return;
    const idx = product.images.indexOf(image);
    const prev = idx <= 0 ? product.images.length - 1 : idx - 1;
    setImage(product.images[prev]);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] || product.imageUrl,
      color,
      size,
      quantity,
    });
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      showErrorToast("Please login to write a product review.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setReviewSubmitting(true);
    try {
      await catalogService.addProductReview(product.id, {
        rating: Number(form.get("rating")),
        comment: form.get("comment"),
      });
      setReviewOpen(false);
      event.currentTarget.reset();
      await refreshReviews(product.id);
      showSuccessToast("Review submitted successfully!");
    } catch (error) {
      showErrorToast(error.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (!product || !store) {
    return (
      <section className="container-shell product-detail-page">
        <p>Loading product...</p>
      </section>
    );
  }

  const colorsList =
    product.colors && product.colors.length
      ? product.colors
      : ["#000000", "#333333", "#EF4444"];
  const sizesList =
    product.sizes && product.sizes.length
      ? product.sizes
      : ["S", "M", "L", "XL"];

  return (
    <section className="container-shell product-detail-page">
      <Breadcrumbs
        items={[
          { label: "Home", path: routes.home },
          { label: "Store", path: routes.stores },
          { label: store.name, path: storePath(store.slug) },
          { label: product.name },
        ]}
      />

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="thumbnail-column">
            {product.images.map((imageUrl) => (
              <button
                className={imageUrl === image ? "active" : ""}
                type="button"
                key={imageUrl}
                onClick={() => setImage(imageUrl)}
              >
                <img src={imageUrl} alt="" />
              </button>
            ))}
          </div>
          <div className="main-product-image" style={{ position: "relative" }}>
            <img src={image} alt={product.name} />
            <button
              type="button"
              aria-label="Previous image"
              onClick={prevImage}
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.8)",
                borderRadius: 999,
                padding: "8px",
              }}
            >
              &lt;
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={nextImage}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.8)",
                borderRadius: 999,
                padding: "8px",
              }}
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="product-info-panel">
          <h1>{product.name}</h1>
          <Stars rating={product.rating} />
          <div className="detail-price-row">
            <strong>{currency(product.price)}</strong>
            {product.compareAtPrice && (
              <span>{currency(product.compareAtPrice)}</span>
            )}
            {discountLabel && <small>{discountLabel}</small>}
          </div>
          <p>{product.description}</p>

          <div className="product-option-block">
            <span>Select Colors</span>
            <div className="swatch-row">
              {colorsList.map((item) => (
                <button
                  className={item === color ? "active" : ""}
                  style={{ backgroundColor: item }}
                  type="button"
                  key={item}
                  onClick={() => setColor(item)}
                  aria-label={`Select color ${item}`}
                >
                  {item === color && <CheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="product-option-block">
            <span>Choose Size</span>
            <div className="size-row">
              {sizesList.map((item) => (
                <button
                  className={item === size ? "active" : ""}
                  type="button"
                  key={item}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="purchase-row">
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              className="btn btn-dark wide"
              type="button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="product-tabs" role="tablist" aria-label="Product content">
        <button
          type="button"
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Product Details
        </button>
        <button
          type="button"
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Rating & Reviews
        </button>
        <button
          type="button"
          className={activeTab === "faqs" ? "active" : ""}
          onClick={() => setActiveTab("faqs")}
        >
          FAQs
        </button>
      </div>

      {activeTab === "details" && (
        <section className="page-section">
          <SectionHeader title="Product Information" />
          <div className="form-panel" style={{ padding: 24 }}>
            <p>{product.description}</p>
            <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
              <div>
                <strong>Category</strong>
                <div className="muted-line">{product.category}</div>
              </div>
              <div>
                <strong>Vendor</strong>
                <div className="muted-line">{store.name}</div>
              </div>
              <div>
                <strong>Availability</strong>
                <div className="muted-line">
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "reviews" && (
        <section className="reviews-section">
          <SectionHeader
            title={`All Reviews (${productReviews.length})`}
            action={
              <div className="review-actions">
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Filter reviews"
                >
                  <SlidersHorizontal size={18} />
                </button>
                <button className="sort-button" type="button">
                  Latest
                </button>
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={() => setReviewOpen(true)}
                >
                  Write a Review
                </button>
              </div>
            }
          />
          <div className="reviews-grid">
            {productReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <Stars rating={review.rating} showValue={false} />
                <h3>
                  {review.authorName || review.name} <CheckCircle size={16} />
                </h3>
                <p>"{review.comment}"</p>
                <span>Posted on {dateLabel(review.createdAt)}</span>
              </article>
            ))}
            {productReviews.length === 0 && (
              <p className="muted-line">No product reviews yet.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === "faqs" && (
        <section className="page-section">
          <SectionHeader title="FAQs" />
          <div className="form-panel" style={{ padding: 24 }}>
            <FAQ
              items={[
                {
                  q: "What is the return policy?",
                  a: "Returns accepted within 7 days for unused items.",
                },
                {
                  q: "How long does delivery take?",
                  a: "Delivery time depends on your location; typically 2-5 business days.",
                },
              ]}
            />
          </div>
        </section>
      )}

      <section className="page-section">
        <SectionHeader title="You might also like" />
        <div className="product-grid compact-grid">
          {related.map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
      </section>

      {reviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-900/5"
            role="dialog"
            aria-modal="true"
            aria-label="Write product review"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Review {product.name}
              </h2>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                type="button"
                onClick={() => setReviewOpen(false)}
                aria-label="Close review form"
              >
                x
              </button>
            </div>
            <form className="space-y-5 px-6 py-6" onSubmit={handleReviewSubmit}>
              <div className="grid gap-2">
                <label className="block text-sm font-medium text-slate-700">
                  Rating
                </label>
                <select
                  name="rating"
                  defaultValue="5"
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option value={rating} key={rating}>
                      {rating} stars
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="block text-sm font-medium text-slate-700">
                  Comment
                </label>
                <textarea
                  name="comment"
                  rows={4}
                  required
                  placeholder="Share your experience"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  style={{ minHeight: 140 }}
                />
              </div>
              <button
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                type="submit"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetailPage;
