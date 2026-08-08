import {
  AlertTriangle,
  CheckCircle,
  Download,
  ShieldAlert,
  Receipt,
  MapPin,
  User,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { routes } from "../../config/routes";
import { useAuth } from "../../plugins/authContext";
import { orderService } from "../../services/orderService";
import { currency, dateLabel } from "../../utils/formatters";

const OrdersPage = () => {
  const { user } = useAuth();

  const [ordersList, setOrdersList] = useState([]);
  const [confirmed, setConfirmed] = useState({});
  const [otpByOrder, setOtpByOrder] = useState({});
  const [disputeOrder, setDisputeOrder] = useState(null);
  const [printOrderId, setPrintOrderId] = useState(null);
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const fetchOrders = () => {
    orderService.getOrders().then(setOrdersList).catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintOrderId(null);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  /*
   * Money helpers
   *
   * JavaScript can produce values such as:
   * 10.1 + 20.2 = 30.299999999999997
   *
   * These helpers keep all bill calculations rounded to 2 decimal places.
   */
  const toNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  };

  const moneyValue = (value) => {
    return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
  };

  const calculateOrderAmounts = (order) => {
    /*
     * Calculate each line item independently.
     */
    const items = Array.isArray(order.items) ? order.items : [];

    const calculatedItems = items.map((item) => {
      const price = moneyValue(item.price);
      const quantity = Math.max(0, toNumber(item.quantity));

      const lineTotal = moneyValue(price * quantity);

      return {
        ...item,
        calculatedPrice: price,
        calculatedQuantity: quantity,
        calculatedLineTotal: lineTotal,
      };
    });

    /*
     * Subtotal always comes from the actual items.
     * This prevents an incorrect/stale subtotal from the API
     * from producing a visually incorrect bill.
     */
    const subtotal = moneyValue(
      calculatedItems.reduce(
        (sum, item) => sum + item.calculatedLineTotal,
        0
      )
    );

    /*
     * Discount cannot be negative and cannot exceed subtotal.
     */
    const requestedDiscount = moneyValue(order.discount);

    const discount = Math.min(
      Math.max(requestedDiscount, 0),
      subtotal
    );

    /*
     * If deliveryFee exists, use it.
     *
     * If it does not exist, derive it from the stored order total:
     *
     * total = subtotal - discount + deliveryFee
     *
     * Therefore:
     *
     * deliveryFee = total - subtotal + discount
     */
    let deliveryFee;

    if (
      order.deliveryFee !== undefined &&
      order.deliveryFee !== null &&
      order.deliveryFee !== ""
    ) {
      deliveryFee = Math.max(0, moneyValue(order.deliveryFee));
    } else if (
      order.total !== undefined &&
      order.total !== null &&
      order.total !== ""
    ) {
      deliveryFee = Math.max(
        0,
        moneyValue(
          toNumber(order.total) - subtotal + discount
        )
      );
    } else {
      deliveryFee = 0;
    }

    /*
     * The displayed grand total is ALWAYS calculated from:
     *
     * subtotal - discount + delivery fee
     *
     * This keeps the bill arithmetic internally consistent.
     */
    const total = moneyValue(
      subtotal - discount + deliveryFee
    );

    return {
      items: calculatedItems,
      subtotal,
      discount,
      deliveryFee,
      total,
    };
  };

  const handleConfirm = async (orderId) => {
    try {
      const result = await orderService.confirmDelivery(
        orderId,
        otpByOrder[orderId]
      );

      setConfirmed((current) => ({
        ...current,
        [orderId]: result,
      }));

      setOtpByOrder((current) => ({
        ...current,
        [orderId]: "",
      }));

      fetchOrders();
    } catch (err) {
      alert(err.message || "OTP verification failed");
    }
  };

  /*
   * Browser print dialog.
   * User can select "Save as PDF".
   */
  const handlePrint = (orderId) => {
    setPrintOrderId(orderId);

    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDisputeSubmit = async (event) => {
    event.preventDefault();

    if (!disputeOrder) return;

    const form = new FormData(event.currentTarget);

    const disputeAmounts = calculateOrderAmounts(disputeOrder);

    setSubmittingDispute(true);

    try {
      await orderService.createDispute({
        orderId: disputeOrder.id,
        reason: form.get("reason"),
        description: form.get("description"),
        priority: form.get("priority"),

        // Use the same calculated amount shown on the bill.
        amount: disputeAmounts.total,
      });

      alert("Dispute opened successfully.");

      setDisputeOrder(null);
      event.currentTarget.reset();
    } catch (error) {
      alert(error.message || "Failed to open dispute");
    } finally {
      setSubmittingDispute(false);
    }
  };

  /*
   * IMPORTANT:
   * Sort a copy of ordersList so React state itself is not mutated.
   *
   * Newest bill -> oldest bill.
   */
  const sortedOrders = [...ordersList].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    const safeDateA = Number.isFinite(dateA) ? dateA : 0;
    const safeDateB = Number.isFinite(dateB) ? dateB : 0;

    return safeDateB - safeDateA;
  });

  return (
    <>
      {/* Print / PDF styles only.
          All normal visual styling below uses Tailwind CSS. */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          html,
          body {
            background: #ffffff !important;
          }

          body * {
            visibility: hidden !important;
          }

          .printing-order .print-target,
          .printing-order .print-target * {
            visibility: visible !important;
          }

          .printing-order .print-target {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .printing-order .no-print {
            display: none !important;
          }

          .printing-order .print-items {
            break-inside: avoid;
          }
        }
      `}</style>

      <section
        className={`min-h-screen bg-slate-50 px-3 py-5 sm:px-5 sm:py-6 lg:px-8 ${
          printOrderId ? "printing-order" : ""
        }`}
      >
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumbs */}
          <div className="no-print mb-4">
            <Breadcrumbs
              items={[
                {
                  label: "Home",
                  path: routes.home,
                },
                {
                  label: "Orders",
                },
              ]}
            />
          </div>

          {/* Page Header */}
          <div className="no-print mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Account
              </p>

              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                My Orders
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Your latest orders and receipts.
              </p>
            </div>

            <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-right shadow-sm sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Orders
              </p>

              <p className="text-lg font-black text-slate-900">
                {ordersList.length}
              </p>
            </div>
          </div>

          {/* Bills */}
          <div className="space-y-4">
            {sortedOrders.map((order, index) => {
              const result = confirmed[order.id];

              const deliveryStatus =
                result?.deliveryStatus || order.deliveryStatus;

              const paymentStatus =
                result?.paymentStatus || order.paymentStatus;

              /*
               * All displayed numbers come from this single calculation.
               */
              const amounts = calculateOrderAmounts(order);

              const {
                items,
                subtotal,
                discount,
                deliveryFee,
                total,
              } = amounts;

              const isLatest = index === 0;

              return (
                <article
                  key={order.id}
                  className={`print-target overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                    isLatest
                      ? "border-slate-300 shadow-md"
                      : "border-slate-200"
                  }`}
                >
                  {/* Top accent */}
                  <div
                    className={`h-1 ${
                      isLatest
                        ? "bg-slate-950"
                        : "bg-slate-200"
                    }`}
                  />

                  {/* Bill Header */}
                  <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isLatest
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Receipt size={17} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-black text-slate-900 sm:text-lg">
                              Bill #{order.id}
                            </h2>

                            {isLatest && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
                                Latest
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {order.shopName || "Vendor shop"}
                          </p>
                        </div>
                      </div>

                      {/* Compact total */}
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                          {currency(total)}
                        </p>
                      </div>
                    </div>

                    {/* Date + Status */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CalendarDays size={13} />

                        <span>{dateLabel(order.createdAt)}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <StatusBadge value={deliveryStatus} />
                        <StatusBadge value={paymentStatus} />
                      </div>
                    </div>
                  </div>

                  {/* Customer / Address */}
                  <div className="grid gap-2.5 px-4 py-3.5 sm:grid-cols-2 sm:px-5">
                    {/* Customer */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <User
                          size={13}
                          className="text-slate-400"
                        />

                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                          Customer
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800">
                        {order.customerName ||
                          order.deliveryAddress?.name ||
                          user?.name ||
                          "Customer"}
                      </p>

                      {(order.deliveryAddress?.phone ||
                        user?.phone) && (
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {order.deliveryAddress?.phone ||
                            user?.phone}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <MapPin
                          size={13}
                          className="text-slate-400"
                        />

                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                          Delivery
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800">
                        {order.deliveryAddress?.city ||
                          "City not provided"}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {order.deliveryAddress?.area ||
                          "Area not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="print-items mx-4 overflow-hidden rounded-xl border border-slate-200 sm:mx-5">
                    {/* Items title */}
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-2">
                      <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                        Items
                      </h3>

                      <span className="text-[10px] font-semibold text-slate-400">
                        {items.length} item
                        {items.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    {/* Desktop header */}
                    <div className="hidden grid-cols-[1fr_55px_90px_100px] gap-2 border-y border-slate-200 px-3 py-2 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 sm:grid">
                      <span>Item</span>
                      <span className="text-right">
                        Qty
                      </span>
                      <span className="text-right">
                        Price
                      </span>
                      <span className="text-right">
                        Total
                      </span>
                    </div>

                    {/* Items */}
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div
                          key={
                            item.id ||
                            item.productId ||
                            item.name
                          }
                          className="grid grid-cols-[1fr_auto] gap-2 border-t border-slate-100 px-3 py-2.5 first:border-t-0 sm:grid-cols-[1fr_55px_90px_100px] sm:items-center"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-800">
                              {item.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400 sm:hidden">
                              {item.calculatedQuantity} ×{" "}
                              {currency(
                                item.calculatedPrice
                              )}
                            </p>
                          </div>

                          <span className="hidden text-right text-xs text-slate-500 sm:block">
                            {item.calculatedQuantity}
                          </span>

                          <span className="hidden text-right text-xs text-slate-500 sm:block">
                            {currency(item.calculatedPrice)}
                          </span>

                          <span className="text-right text-xs font-bold text-slate-900">
                            {currency(
                              item.calculatedLineTotal
                            )}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-xs text-slate-400">
                        No items found.
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="px-4 py-4 sm:px-5">
                    <div className="ml-auto w-full max-w-sm space-y-1.5">
                      <div className="flex justify-between gap-4 text-xs">
                        <span className="text-slate-500">
                          Subtotal
                        </span>

                        <span className="font-medium text-slate-700">
                          {currency(subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 text-xs">
                        <span className="text-slate-500">
                          Discount
                        </span>

                        <span className="font-medium text-emerald-600">
                          -{currency(discount)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 text-xs">
                        <span className="text-slate-500">
                          Delivery Fee
                        </span>

                        <span className="font-medium text-slate-700">
                          {currency(deliveryFee)}
                        </span>
                      </div>

                      {/* Final calculated total */}
                      <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-200 pt-2.5">
                        <span className="text-sm font-black text-slate-900">
                          Grand Total
                        </span>

                        <span className="text-lg font-black tracking-tight text-slate-950">
                          {currency(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment information */}
                  <div className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 sm:mx-5">
                    <span className="text-[10px] text-slate-400">
                      Payment · Delivery
                    </span>

                    <span className="text-[10px] font-bold capitalize text-slate-700">
                      {paymentStatus || "N/A"} ·{" "}
                      {deliveryStatus || "N/A"}
                    </span>
                  </div>

                  {/* Print footer */}
                  <div className="px-4 pb-4 text-right text-[9px] text-slate-400 sm:px-5">
                    Thank you for your order.
                  </div>

                  {/* OTP */}
                  {deliveryStatus !== "delivered" ? (
                    <div className="no-print border-t border-amber-100 bg-amber-50 px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          size={15}
                          className="shrink-0 text-amber-600"
                        />

                        <div className="text-xs">
                          <span className="font-semibold text-amber-900">
                            Delivery OTP:
                          </span>{" "}
                          <strong className="text-amber-800">
                            {order.otpCode}
                          </strong>
                        </div>
                      </div>

                      <form
                        className="mt-2.5 flex flex-col gap-2 sm:flex-row"
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleConfirm(order.id);
                        }}
                      >
                        <input
                          value={
                            otpByOrder[order.id] || ""
                          }
                          onChange={(event) =>
                            setOtpByOrder((current) => ({
                              ...current,
                              [order.id]:
                                event.target.value,
                            }))
                          }
                          placeholder="Enter delivery OTP"
                          className="min-w-0 flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />

                        <button
                          className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                          type="submit"
                        >
                          Confirm Delivery
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="no-print flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 sm:px-5">
                      <CheckCircle size={15} />
                      Delivery confirmed
                    </div>
                  )}

                  {/* Actions */}
                  <div className="no-print flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:px-5">
                    <button
                      type="button"
                      onClick={() =>
                        handlePrint(order.id)
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                    >
                      <Download size={15} />
                      Download Bill
                    </button>

                    {deliveryStatus !== "delivered" && (
                      <button
                        type="button"
                        onClick={() =>
                          setDisputeOrder(order)
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <ShieldAlert size={15} />
                        Open Dispute
                      </button>
                    )}
                  </div>
                </article>
              );
            })}

            {/* Empty state */}
            {ordersList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Receipt size={22} />
                </div>

                <h2 className="mt-4 text-lg font-black text-slate-900">
                  No orders found
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your orders and receipts will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dispute Modal */}
        {disputeOrder && (
          <div
            className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            role="presentation"
          >
            <div
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label="Open dispute"
            >
              {/* Modal Header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Bill #{disputeOrder.id}
                  </p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Open Dispute
                  </h2>
                </div>

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-lg font-bold text-slate-600 transition hover:bg-slate-200"
                  type="button"
                  onClick={() =>
                    setDisputeOrder(null)
                  }
                  aria-label="Close dispute form"
                >
                  ×
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={handleDisputeSubmit}
              >
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    Reason
                  </span>

                  <input
                    name="reason"
                    required
                    placeholder="OTP issue, delivery issue, payment issue"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    Priority
                  </span>

                  <select
                    name="priority"
                    defaultValue="medium"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    Description
                  </span>

                  <textarea
                    name="description"
                    rows={3}
                    required
                    placeholder="Describe what happened"
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </label>

                <button
                  className="w-full rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={submittingDispute}
                >
                  {submittingDispute
                    ? "Opening..."
                    : "Open Dispute"}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default OrdersPage;

