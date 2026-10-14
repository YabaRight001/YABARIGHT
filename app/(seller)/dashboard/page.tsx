'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, ProductCondition } from '@/types';
import { useAdminStore } from '@/store/adminStore';
import { 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  Plus, 
  Pencil, 
  Trash2, 
  BarChart3, 
  Settings, 
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface LiveOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  state: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{ id: string; name: string; quantity: number }>;
}

export default function SellerDashboardPage() {
  const allProducts = useAdminStore((s) => s.products);
  const fetchProducts = useAdminStore((s) => s.fetchProducts);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);

  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchProducts();

    // Fetch live orders
    fetch(`/api/orders?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error('Failed to load seller orders:', err))
      .finally(() => setLoadingOrders(false));
  }, [fetchProducts]);

  const sellerListings = allProducts.slice(0, 8);

  // Financial calculations from real orders
  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
  const totalSalesRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = allProducts.reduce((sum, p) => sum + (p.sold || 0), 0);

  const dynamicStats = [
    {
      label: 'Active Inventory',
      value: `${allProducts.length}`,
      change: 'Catalog products in database',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Verified Sales Revenue',
      value: `₦${totalSalesRevenue.toLocaleString()}`,
      change: `${paidOrders.length} paid customer order(s)`,
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Items Sold',
      value: `${totalItemsSold}`,
      change: 'Units dispatched to buyers',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Platform Orders',
      value: `${orders.length}`,
      change: `${orders.filter((o) => o.orderStatus === 'CONFIRMED').length} pending dispatch`,
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="container-custom py-6 sm:py-10">
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
            Vendor Workspace
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-gray-950">
            Welcome to YabaRight Seller Hub!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Real-time SQLite synchronized dashboard: track store inventory, live customer checkouts, and escrow dispatch.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black hover:scale-105 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dynamicStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#FFD700]/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-gray-950">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-semibold text-gray-400">
                    {stat.change}
                  </p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Products */}
        <section className="lg:col-span-2">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-base font-black text-gray-950">Active Catalog Listings</h2>
                <p className="text-xs text-gray-500 mt-0.5">Live items available to shoppers on YABARIGHT.</p>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold text-[#c88d00] hover:underline flex items-center gap-1"
              >
                <span>View Storefront</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {sellerListings.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl">
                <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-600">No products uploaded yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sellerListings.map((product) => {
                  const img = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/logo.png';
                  return (
                    <div key={product.id} className="flex items-center justify-between py-3.5 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={img}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-950 text-xs truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                            <span className="font-black text-[#c88d00]">₦{product.price.toLocaleString()}</span>
                            <span>•</span>
                            <span>{product.quantity} in stock</span>
                            <span>•</span>
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase">{product.condition}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1 text-[10px] font-bold text-gray-700 transition"
                        >
                          View Live
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Sales Overview Column */}
        <section className="lg:col-span-1">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-black text-gray-950">Fulfillment Status</h2>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-[#fbf8f2] p-3.5">
                <span className="font-semibold text-gray-600">Pending Escrow</span>
                <span className="font-black text-amber-600">
                  {orders.filter((o) => o.orderStatus === 'PENDING').length} order(s)
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#fbf8f2] p-3.5">
                <span className="font-semibold text-gray-600">Confirmed / Dispatched</span>
                <span className="font-black text-blue-600">
                  {orders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'SHIPPED').length} order(s)
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#fbf8f2] p-3.5">
                <span className="font-semibold text-gray-600">Successfully Delivered</span>
                <span className="font-black text-emerald-600">
                  {orders.filter((o) => o.orderStatus === 'DELIVERED').length} order(s)
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <Link
                href="/admin/orders"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#111111] hover:bg-black text-[#FFD700] py-3 text-xs font-black uppercase tracking-wider transition"
              >
                <span>Full Orders Manager</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Real Orders Table */}
      <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-black text-gray-950">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">Live checkouts placed on the marketplace.</p>
          </div>
          <span className="text-xs font-bold text-gray-500">Live Escrow Sync</span>
        </div>

        {loadingOrders ? (
          <p className="text-xs text-gray-400 py-4">Loading real orders...</p>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-2xl">
            <ShoppingBag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-600">No customer orders placed yet</p>
            <p className="text-[11px] text-gray-400 mt-1">Orders placed by customers through the storefront will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-left font-bold uppercase tracking-wider text-gray-400">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-mono font-bold text-gray-900">#{order.orderNumber}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 text-gray-700">{order.city}, {order.state}</td>
                    <td className="py-3.5 font-black text-gray-950">₦{order.total?.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-purple-100 text-purple-800'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link 
          href="/admin/products"
          className="flex items-center gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#FFD700] hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#c88d00]">
            <Plus className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-sm">Add New Product</h3>
            <p className="text-xs text-gray-500">List thrift or retail fashion</p>
          </div>
        </Link>

        <Link 
          href="/admin/orders"
          className="flex items-center gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#FFD700] hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-sm">Order Dispatch</h3>
            <p className="text-xs text-gray-500">Manage order fulfillment</p>
          </div>
        </Link>

        <Link 
          href="/admin/vendors"
          className="flex items-center gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#FFD700] hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-sm">Vendor Verification</h3>
            <p className="text-xs text-gray-500">Check Jiji-style badge</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
