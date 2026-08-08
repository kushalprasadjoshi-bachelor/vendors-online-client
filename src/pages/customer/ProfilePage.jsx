import { useState } from "react";
import { useAuth } from "../../plugins/authContext";
import { filesToDataUrls } from '../../utils/files'
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHeader from "../../components/common/SectionHeader";
import { routes } from "../../config/routes";

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [preview, setPreview] = useState(user?.avatarUrl || "")

  const handleChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleFile = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    try {
      const data = await filesToDataUrls(files)
      setPreview(data[0])
      setForm((s) => ({ ...s, avatarUrl: data[0] }))
    } catch (err) {
      console.error(err)
      alert('Failed to read image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = { ...form, profilePic: form.avatarUrl }
      const updated = await updateProfile(user.id, payload);
      if (updated) alert("Profile updated");
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return (
      <section className="container-shell page-section">
        <p>Please login to view your profile.</p>
      </section>
    );

  return (
    <section className="container-shell page-section">
      <Breadcrumbs
        items={[{ label: "Home", path: routes.home }, { label: "Profile" }]}
      />
      <SectionHeader title="My Profile" />
      <div
        className="grid"
        style={{ gridTemplateColumns: "360px 1fr", gap: "28px" }}
      >
        <aside className="form-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: "#eee",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%" }} />
              )}
            </div>
            <div>
              <strong>{user.name}</strong>
              <div className="muted-line">{user.email}</div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              className="btn btn-dark wide"
              type="button"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </aside>

        <main>
          <form
            className="form-panel"
            onSubmit={handleSubmit}
            style={{ padding: 24 }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <label className="block">
                <div className="text-sm font-medium text-slate-700">
                  Full name
                </div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </label>

              <label className="block">
                <div className="text-sm font-medium text-slate-700">
                  Email address
                </div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </label>

              <label className="block">
                <div className="text-sm font-medium text-slate-700">
                  Phone
                </div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 64, height: 64, background: "#eee", borderRadius: 999, overflow: "hidden" }}>
                  {preview ? (
                    <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%" }} />
                  )}
                </div>
                <label className="block" style={{ flex: 1 }}>
                  <div className="text-sm font-medium text-slate-700">Profile picture</div>
                  <input type="file" accept="image/*" onChange={handleFile} className="mt-2" />
                  <div className="muted-line mt-2">Upload an image; it will be saved to your profile.</div>
                </label>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  className="pill-link"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </section>
  );
};

export default ProfilePage;
