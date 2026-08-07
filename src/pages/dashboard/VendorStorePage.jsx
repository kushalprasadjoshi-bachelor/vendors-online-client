import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../plugins/authContext";
import { apiClient } from "../../services/apiClient";
import { catalogService } from "../../services/catalogService";
import { fileToDataUrl } from "../../utils/files";

const VendorStorePage = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStore = async () => {
    if (!user) return;
    try {
      const stores = await catalogService.getVendorStores(user.id);
      const myShop = stores[0];
      if (myShop) {
        setShop(myShop);
        setBannerPreview(myShop.bannerUrl || myShop.imageUrl || "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, [user]);

  const handleBannerUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBannerPreview(await fileToDataUrl(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!shop) return;
    const form = event.currentTarget;

    try {
      await apiClient.patch(`/shop/${shop.id}`, {
        name: form.elements.name.value,
        category: form.elements.category.value,
        location: form.elements.location.value,
        description: form.elements.description.value,
        banner: bannerPreview,
      });
      alert("Storefront updated successfully!");
      loadStore();
    } catch (err) {
      alert(err.message || "Failed to save store");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <p>Loading store settings...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="dashboard-content max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-600">
          No store found. Try registering a new vendor account.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-content max-w-5xl mx-auto px-4 py-8">
      <section className="dashboard-panel store-editor rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="dashboard-panel-heading mb-6 sm:flex sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Storefront Settings
            </h2>
            <span className="mt-2 block text-sm text-slate-600">
              Shop information and branding details for customers.
            </span>
          </div>
        </div>
        <form className="grid gap-5" onSubmit={handleSave}>
          <label className="block text-sm font-medium text-slate-700">
            Store Name
            <input
              name="name"
              defaultValue={shop.name}
              required
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Category
            <input
              name="category"
              defaultValue={shop.categories ? shop.categories[0] : ""}
              required
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Location
            <input
              name="location"
              defaultValue={shop.city || ""}
              placeholder="Kathmandu"
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Banner Image
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              name="description"
              defaultValue={shop.description}
              rows={5}
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          {bannerPreview && (
            <div className="store-banner-preview full rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
              <img
                className="w-full rounded-3xl object-cover"
                src={bannerPreview}
                alt="Store banner preview"
              />
            </div>
          )}

          <button
            className="btn btn-dark inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            type="submit"
          >
            <Save size={18} />
            Save Storefront
          </button>
        </form>
      </section>
    </div>
  );
};

export default VendorStorePage;
