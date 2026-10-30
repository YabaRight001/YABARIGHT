'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';
import {
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  Plus,
  ArrowRight,
  ExternalLink,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{ id: string; name: string; quantity: number }>;
}

export default function AdminOverviewPage() {
  const { products, vendors, users, registrationStats, verifyVendor, deleteProduct, fetchProducts, fetchVendors, fetchUsers } = useAdminStore();
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchProducts();
    if (typeof fetchVendors === 'function') fetchVendors();
    if (typeof fetchUsers === 'function') fetchUsers();

    // Fetch live orders
    fetch(`/api/orders?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error('Failed to load overview orders:', err))
      .finally(() => setLoadingOrders(false));
  }, [fetchProducts, fetchVendors, fetchUsers]);

  const pendingVendors = vendors.filter((v) => !v.isVerified);
  const verifiedVendors = vendors.filter((v) => v.isVerified);
  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const totalRegisteredCount = registrationStats?.totalRegistered ?? users.length;
  const weekRegistrationsCount = registrationStats?.weekCount ?? 0;
  const todayRegistrationsCount = registrationStats?.todayCount ?? 0;
  const monthRegistrationsCount = registrationStats?.monthCount ?? 0;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      title: 'Total Products in Shop',
      value: products.length.toString(),
      desc: 'Active catalogue listings',
      icon: Package,
      color: 'text-[#FFD700]',
      bg: 'bg-[#FFD700]/10',
      href: '/admin/products',
    },
    {
      title: 'Verified Vendors',
      value: verifiedVendors.length.toString(),
      desc: `${vendors.length} Total Registered Vendors`,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      href: '/admin/vendors',
    },
    {
      title: 'Platform Customer Orders',
      value: orders.length.toString(),
      desc: `₦${totalRevenue.toLocaleString()} Paid Volume`,
      icon: ShoppingBag,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      href: '/admin/orders',
    },
    {
      title: 'Total Registered Users',
      value: totalRegisteredCount.toString(),
      desc: `${weekRegistrationsCount > 0 ? `+${weekRegistrationsCount} this week • ` : ''}${activeUsersCount} Active`,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      href: '/admin/users',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#181818] via-[#201c0c] to-[#181818] border border-[#FFD700]/25 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FFD700] mb-3">
            <Sparkles className="h-3 w-3" />
            YABARIGHT Central Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to Admin Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-400 max-w-xl">
            Upload official brand products, view real-time shop listings, and manage customer orders and vendor verifications.
          </p>
        </div>

        {/* Action Buttons: Add Product (+) & View Shop Catalogue */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products?new=true"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-lg shadow-[#FFD700]/20"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition"
          >
            <Eye className="h-4 w-4" />
            <span>View Shop Catalogue</span>
          </Link>
          <Link
            href="/admin/vendors"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
          >
            <ShieldCheck className="h-4 w-4 text-[#FFD700]" />
            <span>Verify Vendors</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.title}
              href={s.href}
              className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-sm hover:border-[#FFD700]/40 transition group cursor-pointer block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition">{s.title}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${s.bg} ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl sm:text-3xl font-black text-white">{s.value}</p>
              <p className="mt-1 text-[11px] text-gray-400">{s.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* User Registration Velocity Quick Banner */}
      <div className="rounded-[2rem] border border-blue-500/20 bg-blue-500/[0.03] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              User Registration Velocity
              {todayRegistrationsCount > 0 && (
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5">
                  +{todayRegistrationsCount} NEW TODAY
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              <strong className="text-white">{todayRegistrationsCount}</strong> registered today •{' '}
              <strong className="text-white">{weekRegistrationsCount}</strong> past 7 days •{' '}
              <strong className="text-white">{monthRegistrationsCount}</strong> past 30 days
            </p>
          </div>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/20 hover:text-white transition self-start md:self-auto"
        >
          <span>View Registration Breakdown</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Pending Vendor Verification Action Center */}
      {pendingVendors.length > 0 && (
        <div className="rounded-[2rem] border border-amber-500/30 bg-amber-500/[0.04] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-black text-white">
                Pending Vendor Verifications ({pendingVendors.length})
              </h2>
            </div>
            <Link
              href="/admin/vendors"
              className="text-xs font-bold text-[#FFD700] hover:underline flex items-center gap-1"
            >
              <span>Manage All Vendors</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {pendingVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-2xl border border-white/10 bg-[#161616] p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-black text-white">{vendor.shopName}</p>
                  <p className="text-[11px] text-gray-400">{vendor.name} • {vendor.idType}</p>
                  <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">{vendor.idNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => verifyVendor(vendor.id)}
                  className="rounded-full bg-emerald-500 hover:bg-emerald-400 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-black transition flex items-center gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verify</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products Overview */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#141414] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Recent Catalog Products</h2>
            <p className="text-xs text-gray-400">View live products in shop catalogue or add new items.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products?new=true"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700] px-4 py-2 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/products"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-gray-200 transition"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#FFD700]" />
              <span>Shop Catalogue ({products.length})</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Products Uploaded Yet</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Your shop catalogue is currently empty. Click below to add your first product.
            </p>
            <Link
              href="/admin/products?new=true"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase text-black hover:bg-[#ffcc00] transition"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Condition</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.slice(0, 10).map((product) => {
                  const img = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/casual-shirts-colorful.jpg';
                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={product.name}
                            className="h-10 w-10 rounded-xl object-cover bg-white/5 flex-shrink-0 border border-white/10"
                          />
                          <div>
                            <p className="font-bold text-white line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-gray-400">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-300 font-medium">{product.category}</td>
                      <td className="py-3.5">
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-gray-300 uppercase">
                          {product.condition}
                        </span>
                      </td>
                      <td className="py-3.5 font-black text-[#FFD700]">₦{product.price.toLocaleString()}</td>
                      <td className="py-3.5 text-gray-300">{product.quantity} units</td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/15 px-2.5 py-1 text-[11px] font-bold text-[#FFD700] transition"
                            title="View product in shop catalogue"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View in Shop</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300 transition p-1"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
