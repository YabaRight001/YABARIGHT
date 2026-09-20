'use client';

import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';
import {
  Package,
  ShieldCheck,
  ShieldAlert,
  Users,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trash2,
  Store,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { products, vendors, users, verifyVendor, deleteProduct } = useAdminStore();

  const verifiedVendors = vendors.filter((v) => v.isVerified);
  const pendingVendors = vendors.filter((v) => !v.isVerified);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const stats = [
    {
      title: 'Total Active Products',
      value: products.length,
      desc: `${products.filter((p) => p.sellerId === 'admin-official').length} YabaRight Official`,
      icon: Package,
      color: 'text-[#FFD700]',
      bg: 'bg-[#FFD700]/10',
    },
    {
      title: 'Verified Vendors (Jiji-Badge)',
      value: verifiedVendors.length,
      desc: `${vendors.length} Total Registered Vendors`,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Pending Verification',
      value: pendingVendors.length,
      desc: 'Vendors awaiting badge review',
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Platform Users & Buyers',
      value: users.length,
      desc: 'Active registered accounts',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
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
            Upload official brand products, moderate substandard listings/users, and manage Jiji-style vendor verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Upload Product</span>
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
            <div
              key={s.title}
              className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-sm hover:border-[#FFD700]/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">{s.title}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${s.bg} ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl sm:text-3xl font-black text-white">{s.value}</p>
              <p className="mt-1 text-[11px] text-gray-400">{s.desc}</p>
            </div>
          );
        })}
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Recent Catalog Products</h2>
            <p className="text-xs text-gray-400">Manage and delete products not up to platform standard.</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#FFD700] hover:underline flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-400">
                <th className="pb-3">Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Condition</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.slice(0, 5).map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0] || '/casual-shirts-colorful.jpg'}
                        alt={product.name}
                        className="h-10 w-10 rounded-xl object-cover bg-white/5 flex-shrink-0"
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
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-400 hover:text-red-300 transition p-1"
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
