import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "../../components/dashboard/DataTable";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../plugins/authContext";
import { apiClient } from "../../services/apiClient";
import { catalogService } from "../../services/catalogService";
import { filesToDataUrls } from "../../utils/files";
import { currency } from "../../utils/formatters";

const fallbackImage =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  category: "General",
  onSale: false,
  colors: "",
  sizes: "",
  images: [],
};

const VendorProductsPage = () => {
  const { user } = useAuth();
  const [productsList, setProductsList] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    if (!user) return;
    try {
      const stores = await catalogService.getVendorStores(user.id);
      const myShop = stores[0];
      if (myShop) {
        setShop(myShop);
        const prods = await catalogService.getProducts(myShop.id);
        setProductsList(prods);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.originalPrice || product.compareAtPrice || product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      category: product.category || "General",
      onSale: Boolean(product.onSale),
      colors: product.colors?.join(", ") || "",
      sizes: product.sizes?.join(", ") || "",
      images: product.images || [],
    });
    setModalOpen(true);
  };

  const updateForm = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageUpload = async (event) => {
    const images = await filesToDataUrls(event.target.files);
    if (images.length)
      updateForm("images", [...(productForm.images || []), ...images]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!shop) {
      alert("Shop not found for vendor");
      return;
    }

    const payload = {
      shopId: shop.id,
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice
        ? Number(productForm.discountPrice)
        : null,
      stock: Number(productForm.stock),
      category: productForm.category || "General",
      onSale: productForm.onSale || Boolean(productForm.discountPrice),
      colors: productForm.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      sizes: productForm.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images: productForm.images.length ? productForm.images : [fallbackImage],
    };

    setSaving(true);
    try {
      if (editingProduct) {
        await apiClient.patch(`/shop/product/${editingProduct.id}`, payload);
      } else {
        await apiClient.post("/shop/product", payload);
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      alert(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`))
      return;
    try {
      await apiClient.delete(`/shop/product/${product.id}`);
      await loadProducts();
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (row) => (
        <span className="table-product">
          <img src={row.images[0] || fallbackImage} alt="" />
          {row.name}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => row.category || "General",
    },
    { key: "price", label: "Price", render: (row) => currency(row.price) },
    { key: "stock", label: "Stock" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge value={row.onSale ? "on sale" : row.status || "active"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <span className="table-actions">
          <button
            type="button"
            aria-label="Edit product"
            onClick={() => openEditModal(row)}
          >
            <Edit3 size={17} />
          </button>
          <button
            type="button"
            aria-label="Delete product"
            onClick={() => handleDeleteProduct(row)}
          >
            <Trash2 size={17} />
          </button>
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-content">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Product Listings</h2>
            <span>Add, update, and remove vendor products.</span>
          </div>
          <button
            className="btn btn-dark inline-flex items-center justify-center gap-2 whitespace-nowrap"
            type="button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
        <DataTable columns={columns} rows={productsList} />
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="presentation"
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Product form"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                className="text-2xl text-slate-400 hover:text-slate-600"
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close product form"
              >
                ×
              </button>
            </div>
            <form
              className="grid gap-3 max-h-96 overflow-y-auto"
              onSubmit={handleSubmit}
            >
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Category
                </span>
                <input
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Price
                </span>
                <input
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.price}
                  type="number"
                  min="0"
                  onChange={(event) => updateForm("price", event.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Discount Price
                </span>
                <input
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.discountPrice}
                  type="number"
                  min="0"
                  onChange={(event) =>
                    updateForm("discountPrice", event.target.value)
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Stock
                </span>
                <input
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.stock}
                  type="number"
                  min="0"
                  onChange={(event) => updateForm("stock", event.target.value)}
                  required
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  checked={productForm.onSale}
                  type="checkbox"
                  onChange={(event) =>
                    updateForm("onSale", event.target.checked)
                  }
                />
                <span>On sale</span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Colors
                </span>
                <input
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.colors}
                  onChange={(event) => updateForm("colors", event.target.value)}
                  placeholder="#111111, #333333"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Sizes
                </span>
                <input
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.sizes}
                  onChange={(event) => updateForm("sizes", event.target.value)}
                  placeholder="S, M, L, XL"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Description
                </span>
                <textarea
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  value={productForm.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={4}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Images
                </span>
                <input
                  className="mt-1 block w-full text-sm text-slate-700 file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
              {productForm.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {productForm.images.map((imageUrl, idx) => (
                    <div key={imageUrl + idx} className="relative">
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-24 w-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Remove image"
                        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-700 shadow"
                        onClick={() =>
                          updateForm(
                            "images",
                            productForm.images.filter((_, i) => i !== idx),
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="inline-flex justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProductsPage;
