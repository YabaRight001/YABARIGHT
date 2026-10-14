'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Sparkles,
  CreditCard,
  Banknote,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  paymentRef?: string;
  affiliateRef?: string;
  items: OrderItem[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const showToast = useToastStore((s) => s.showToast);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      showToast('Failed to load platform orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, orderNumber: string, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, orderStatus: nextStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: nextStatus } : o))
        );
        showToast(`Order ${orderNumber} updated to ${nextStatus}`, 'success');
      } else {
        showToast('Failed to update order status.', 'error');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      showToast('Error updating order status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdatePayment = async (orderId: string, orderNumber: string, nextPayment: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, paymentStatus: nextPayment }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: nextPayment } : o))
        );
        showToast(`Payment for ${orderNumber} marked as ${nextPayment}`, 'success');
      } else {
        showToast('Failed to update payment status.', 'error');
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      showToast('Error updating payment status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      order.customerPhone.toLowerCase().includes(q) ||
      order.city.toLowerCase().includes(q) ||
      order.items?.some((i) => i.name.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const confirmedCount = orders.filter((o) => o.orderStatus === 'CONFIRMED').length;
  const shippedCount = orders.filter((o) => o.orderStatus === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#181818] via-[#201c0c] to-[#181818] border border-[#FFD700]/25 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FFD700] mb-3">
            <Sparkles className="h-3 w-3" />
            Live Database Orders
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Customer Orders & Fulfillment
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-400 max-w-xl">
            Live orders verified from SQLite database. Track shipments, update fulfillment statuses, and manage payments.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Total Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFD700]/10 text-[#FFD700]">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-white">{orders.length}</p>
          <p className="mt-1 text-[11px] text-gray-400">Recorded in Prisma SQLite</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Paid Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-white">₦{totalRevenue.toLocaleString()}</p>
          <p className="mt-1 text-[11px] text-gray-400">From paid customer checkouts</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Awaiting Shipment</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-white">{confirmedCount}</p>
          <p className="mt-1 text-[11px] text-gray-400">Confirmed, ready to pack</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Delivered</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-white">{deliveredCount}</p>
          <p className="mt-1 text-[11px] text-gray-400">Completed deliveries</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer, phone, item..."
            className="w-full rounded-2xl border border-white/10 bg-[#161616] pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'CONFIRMED', 'PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition ${
                statusFilter === st
                  ? 'bg-[#FFD700] text-black shadow-md'
                  : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-[#141414] p-12 text-center">
          <RefreshCw className="h-8 w-8 text-[#FFD700] animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-300">Loading orders from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-[#141414] p-12 text-center">
          <ShoppingBag className="h-10 w-10 text-gray-500 mx-auto mb-3" />
          <p className="text-base font-black text-white">No orders found</p>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'ALL'
              ? 'No orders match your filter criteria.'
              : 'No orders have been placed yet. As customers checkout on the store, their orders will appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-[2rem] border border-white/10 bg-[#141414] p-5 sm:p-6 hover:border-[#FFD700]/30 transition space-y-4 shadow-sm"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-black text-[#FFD700]">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {order.affiliateRef && (
                      <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                        Ref: {order.affiliateRef}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Payment Status Dropdown */}
                    <div className="relative inline-block">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePayment(order.id, order.orderNumber, e.target.value)}
                        disabled={isUpdating}
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider border cursor-pointer appearance-none pr-7 focus:outline-none ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : order.paymentStatus === 'FAILED'
                            ? 'bg-red-500/15 border-red-500/30 text-red-400'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        }`}
                      >
                        <option value="PAID" className="bg-[#1a1a1a] text-white">Payment: PAID</option>
                        <option value="PENDING" className="bg-[#1a1a1a] text-white">Payment: PENDING</option>
                        <option value="FAILED" className="bg-[#1a1a1a] text-white">Payment: FAILED</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-60" />
                    </div>

                    {/* Order Status Dropdown */}
                    <div className="relative inline-block">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order.id, order.orderNumber, e.target.value)}
                        disabled={isUpdating}
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider border cursor-pointer appearance-none pr-7 focus:outline-none ${
                          order.orderStatus === 'DELIVERED'
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                            : order.orderStatus === 'SHIPPED'
                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                            : order.orderStatus === 'CONFIRMED'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : order.orderStatus === 'CANCELLED'
                            ? 'bg-red-500/15 border-red-500/30 text-red-400'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        <option value="CONFIRMED" className="bg-[#1a1a1a] text-white">Status: CONFIRMED</option>
                        <option value="PENDING" className="bg-[#1a1a1a] text-white">Status: PENDING</option>
                        <option value="SHIPPED" className="bg-[#1a1a1a] text-white">Status: SHIPPED</option>
                        <option value="DELIVERED" className="bg-[#1a1a1a] text-white">Status: DELIVERED</option>
                        <option value="CANCELLED" className="bg-[#1a1a1a] text-white">Status: CANCELLED</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-60" />
                    </div>
                  </div>
                </div>

                {/* Main Body: Customer Details & Order Items */}
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Customer Info */}
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-gray-300 uppercase tracking-wider text-[10px]">Customer Details</p>
                    <p className="font-black text-white text-sm">{order.customerName}</p>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Mail className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      <a href={`mailto:${order.customerEmail}`} className="hover:underline truncate">{order.customerEmail}</a>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Phone className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      <a href={`tel:${order.customerPhone}`} className="hover:underline">{order.customerPhone}</a>
                    </div>
                    <div className="flex items-start gap-1.5 text-gray-400">
                      <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span>{order.address}, {order.city}, {order.state}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="md:col-span-2 space-y-3">
                    <p className="font-bold text-gray-300 uppercase tracking-wider text-[10px]">
                      Items Purchased ({order.items?.length || 0})
                    </p>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.02] border border-white/5 p-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || '/logo.png'}
                              alt={item.name}
                              className="h-10 w-10 rounded-xl object-cover bg-white/5 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white text-xs line-clamp-1">{item.name}</p>
                              <p className="text-[10px] text-gray-400">
                                Qty: <span className="text-white font-semibold">{item.quantity}</span>
                                {item.size && ` • Size: ${item.size}`}
                                {item.color && ` • Color: ${item.color}`}
                              </p>
                            </div>
                          </div>
                          <span className="font-black text-[#FFD700] text-xs">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Financials Breakdown */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs">
                      <div className="flex items-center gap-4 text-gray-400 text-[11px]">
                        <span>Subtotal: ₦{order.subtotal?.toLocaleString()}</span>
                        <span>Shipping: {order.shippingCost === 0 ? 'FREE' : `₦${order.shippingCost?.toLocaleString()}`}</span>
                        <span>Tax: ₦{order.tax?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Order Total:</span>
                        <span className="text-base font-black text-[#FFD700]">
                          ₦{order.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
