import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { storage } from "../../utils/storage";

const settingsKey = "vendors_online_admin_settings";

const defaultSettings = {
  siteName: "VendorsOnline",
  supportEmail: "support@vendorsonline.test",
  defaultDeliveryFee: 15,
  maintenanceMode: false,
  orderNotifications: true,
  disputeNotifications: true,
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    setSettings(storage.get(settingsKey, defaultSettings));
  }, []);

  const updateSetting = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    storage.set(settingsKey, settings);
    alert("Settings saved successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <section className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Platform Settings
          </h2>
          <p className="text-gray-600 mt-2">
            Configure core marketplace behavior and notifications.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              value={settings.siteName}
              onChange={(event) =>
                updateSetting("siteName", event.target.value)
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Email
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              value={settings.supportEmail}
              type="email"
              onChange={(event) =>
                updateSetting("supportEmail", event.target.value)
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Delivery Fee
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              value={settings.defaultDeliveryFee}
              type="number"
              min="0"
              onChange={(event) =>
                updateSetting("defaultDeliveryFee", Number(event.target.value))
              }
            />
          </div>
          <div className="space-y-8 space-x-4 pt-4 border-t border-gray-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                className="w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                checked={settings.maintenanceMode}
                type="checkbox"
                onChange={(event) =>
                  updateSetting("maintenanceMode", event.target.checked)
                }
              />
              <span className="text-sm font-medium text-gray-700">
                Maintenance mode
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                className="w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                checked={settings.orderNotifications}
                type="checkbox"
                onChange={(event) =>
                  updateSetting("orderNotifications", event.target.checked)
                }
              />
              <span className="text-sm font-medium text-gray-700">
                Order notifications
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                className="w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                checked={settings.disputeNotifications}
                type="checkbox"
                onChange={(event) =>
                  updateSetting("disputeNotifications", event.target.checked)
                }
              />
              <span className="text-sm font-medium text-gray-700">
                Dispute notifications
              </span>
            </label>
          </div>
          <button
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            type="submit"
          >
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminSettingsPage;
