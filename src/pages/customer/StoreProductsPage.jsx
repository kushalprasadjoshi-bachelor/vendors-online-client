import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Pagination from "../../components/common/Pagination";
import ProductCard from "../../components/common/ProductCard";
import SectionHeader from "../../components/common/SectionHeader";
import ShopReviewSection from "../../components/common/ShopReviewSection";
import { routes, storePath } from "../../config/routes";
import { catalogService } from "../../services/catalogService";

const PAGE_SIZE = 12;

const StoreProductsPage = () => {
  const { storeSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [page, setPage] = useState(1);
  const sort = searchParams.get("sort") || "latest";

  useEffect(() => {
    if (storeSlug) {
      catalogService
        .getStoreBySlug(storeSlug)
        .then(setStore)
        .catch(console.error);
    }
  }, [storeSlug]);

  useEffect(() => {
    if (storeSlug) {
      catalogService
        .getProducts(storeSlug, { sort })
        .then(setStoreProducts)
        .catch(console.error);
      setPage(1);
    }
  }, [sort, storeSlug]);

  const setSort = (value) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", value);
    setSearchParams(next);
  };

  if (!store) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500">Loading store...</p>
      </section>
    );
  }

  const totalPages = Math.max(1, Math.ceil(storeProducts.length / PAGE_SIZE));
  const visibleProducts = storeProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const showingFrom = storeProducts.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const showingTo = Math.min(page * PAGE_SIZE, storeProducts.length);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", path: routes.home },
          { label: "Stores", path: routes.stores },
          { label: store.name, path: storePath(store.slug) },
        ]}
      />
      <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="relative h-52 overflow-hidden sm:h-64">
            <img
              className="h-full w-full object-cover"
              src={store.bannerUrl || store.imageUrl}
              alt={store.name}
            />
          </div>
          <div className="space-y-4 p-6 sm:p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {store.name}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              {store.description}
            </p>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {store.city || "Online"}, {store.country}
            </span>
          </div>
        </div>
      </div>
      <SectionHeader
        title="Our Products"
        meta={`Showing ${showingFrom}-${showingTo} of ${storeProducts.length} Products`}
        action={
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="latest">Latest</option>
              <option value="cheapest">Cheapest</option>
              <option value="expensive">Most Expensive</option>
              <option value="popular">Most Popular</option>
              <option value="sale">On Sale First</option>
            </select>
          </label>
        }
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      {visibleProducts.length === 0 && (
        <p className="mt-6 text-center text-sm text-slate-500">
          This store has no products yet.
        </p>
      )}
      <div className="mt-10">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      <div className="mt-10">
        <ShopReviewSection shop={store} />
      </div>
    </section>
  );
};

export default StoreProductsPage;
