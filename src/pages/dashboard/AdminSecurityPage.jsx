import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../plugins/authContext";
import { apiClient } from "../../services/apiClient";
import { storage } from "../../utils/storage";

const auditKey = "vendors_online_audit_log";

const AdminSecurityPage = () => {
  const { logout, user } = useAuth();
  const [auditLog, setAuditLog] = useState(() => storage.get(auditKey, []));
  const token = storage.get("vendors_online_token");

  const pushAudit = (message) => {
    const next = [
      { message, createdAt: new Date().toISOString() },
      ...auditLog,
    ].slice(0, 10);
    setAuditLog(next);
    storage.set(auditKey, next);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await apiClient.patch(`/user/${user.id}`, { password });
      pushAudit("Admin password changed");
      event.currentTarget.reset();
      alert("Password changed successfully.");
    } catch (error) {
      alert(error.message || "Failed to change password");
    }
  };

  const handleEndSession = () => {
    pushAudit("Admin session ended");
    logout();
    // ensure user is redirected to the login page after session end
    try {
      window.location.href = "/login";
    } catch (e) {
      // fallback: reload the page
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <section className="bg-white shadow rounded-lg">
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Security</h2>
            <span className="text-sm text-gray-500">
              Password, sessions, and audit activity.
            </span>
          </div>
          <StatusBadge value="admin" />
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <form
            className="md:col-span-2 space-y-4"
            onSubmit={handlePasswordChange}
          >
            <h3 className="flex items-center gap-2 text-md font-medium">
              <KeyRound size={18} />
              Change Admin Password
            </h3>
            <label className="block">
              <span className="text-sm text-gray-700">New Password</span>
              <input
                name="password"
                type="password"
                minLength={6}
                required
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Confirm Password</span>
              <input
                name="confirmPassword"
                type="password"
                minLength={6}
                required
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300"
              />
            </label>
            <div>
              <button
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                type="submit"
              >
                Update Password
              </button>
            </div>
          </form>

          <div className="bg-gray-50 p-4 rounded-md flex flex-col justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-md font-medium">
                <ShieldCheck size={18} />
                Active Session
              </h3>
              <p className="mt-2 text-sm text-gray-700">{user?.email}</p>
              <span className="block mt-1 text-xs text-gray-500">
                {token ? `${token.slice(0, 14)}...` : "No token found"}
              </span>
            </div>
            <div className="mt-4">
              <button
                className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
                type="button"
                onClick={handleEndSession}
              >
                <LogOut size={18} />
                End Session
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white shadow rounded-lg">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Audit Log</h2>
          <span className="text-sm text-gray-500">
            Recent local administrative security events.
          </span>
        </div>
        <div className="p-6 space-y-4">
          {auditLog.map((item) => (
            <div
              key={`${item.message}-${item.createdAt}`}
              className="flex items-center justify-between bg-gray-50 p-3 rounded"
            >
              <strong className="text-sm">{item.message}</strong>
              <span className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
          {auditLog.length === 0 && (
            <p className="text-sm text-gray-500">
              No security events recorded yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminSecurityPage;
