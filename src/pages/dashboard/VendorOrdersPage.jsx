import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "../../components/dashboard/DataTable";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { orderService } from "../../services/orderService";
import { currency, dateLabel } from "../../utils/formatters";

const VendorOrdersPage = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disputeOrder, setDisputeOrder] = useState(null);
  const [submittingDispute, setSubmittingDispute] = useState(false);

  useEffect(() => {
    orderService
      .getOrders()
      .then((data) => {
        setOrdersList(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleDisputeSubmit = async (event) => {
    event.preventDefault();
    if (!disputeOrder) return;
    const form = new FormData(event.currentTarget);
    setSubmittingDispute(true);
    try {
      await orderService.createDispute({
        orderId: disputeOrder.id,
        reason: form.get("reason"),
        description: form.get("description"),
        priority: form.get("priority"),
        amount: disputeOrder.total,
      });
      alert("Dispute opened successfully.");
      setDisputeOrder(null);
    } catch (error) {
      alert(error.message || "Failed to open dispute");
    } finally {
      setSubmittingDispute(false);
    }
  };

  const columns = [
    { key: "id", label: "Order" },
    {
      key: "customerName",
      label: "Customer",
      render: (row) => row.customerName || "Customer",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => dateLabel(row.createdAt),
    },
    {
      key: "items",
      label: "Items",
      render: (row) =>
        row.items ? row.items.map((item) => item.name).join(", ") : "",
    },
    { key: "total", label: "Total", render: (row) => currency(row.total) },
    {
      key: "deliveryStatus",
      label: "Delivery",
      render: (row) => <StatusBadge value={row.deliveryStatus} />,
    },
    {
      key: "paymentStatus",
      label: "Escrow",
      render: (row) => <StatusBadge value={row.paymentStatus} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <span className="table-actions">
          <button
            type="button"
            aria-label="Open dispute"
            onClick={() => setDisputeOrder(row)}
          >
            <ShieldAlert size={17} />
          </button>
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-content">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Order Management</h2>
            <span>Track delivery states and escrow release readiness.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={ordersList} />
      </section>

      {disputeOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
            role="dialog"
            aria-modal="true"
            aria-label="Open dispute"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Open Dispute
                </h2>
              </div>
              <button
                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                type="button"
                onClick={() => setDisputeOrder(null)}
                aria-label="Close dispute form"
              >
                ×
              </button>
            </div>
            <form className="grid gap-4" onSubmit={handleDisputeSubmit}>
              <label className="block text-sm font-medium text-slate-700">
                Reason
                <input
                  name="reason"
                  required
                  placeholder="Delivery or payment concern"
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Priority
                <select
                  name="priority"
                  defaultValue="medium"
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Description
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Describe the issue"
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </label>
              <button
                className="mt-2 inline-flex justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={submittingDispute}
              >
                {submittingDispute ? "Opening..." : "Open Dispute"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrdersPage;
