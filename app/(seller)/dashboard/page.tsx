'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Order, OrderStatus, ProductCondition } from '@/types';
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
  Sparkles
} from 'lucide-react';

const mockSellerName = 'Fashion House Lagos';

const stats = [
  { 
    label: 'Total Products', 
    value: '24', 
    change: '+3 this month',
    icon: Package,
    color: 'bg-blue-50 text-blue-600'
  },
  { 
    label: 'Total Sales', 
    value: '₦847,500', 
    change: '+18.4% vs last mo',
    icon: ShoppingBag,
    color: 'bg-emerald-50 text-emerald-600'
  },
  { 
    label: 'Store Revenue', 
    value: '₦2.4M', 
    change: '+24.1% annualized',
    icon: TrendingUp,
    color: 'bg-purple-50 text-purple-600'
  },
  { 
    label: 'Orders Processed', 
    value: '156', 
    change: '+12 dispatched today',
    icon: Sparkles,
    color: 'bg-amber-50 text-amber-600'
  },
];

const recentProducts: Partial<Product>[] = [
  {
    id: '1',
    name: 'Classic Polo Shirt - Navy',
    price: 14000,
    quantity: 45,
    sold: 28,
    condition: ProductCondition.NEW,
    published: true,
    images: ['/polo-shirts.jpg'],
    category: "Shirts",
    rating: 4.8
  },
  {
    id: '2',
    name: 'Vintage Washed Denim Jeans',
    price: 12500,
    quantity: 8,
    sold: 12,
    condition: ProductCondition.LIKE_NEW,
    published: true,
    images: ['/jeans-stack.jpg'],
    category: 'Clothing',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Chop Corporate Shoes - Leather',
    price: 22999,
    quantity: 15,
    sold: 5,
    condition: ProductCondition.NEW,
    published: true,
    images: ['/male-shoes-collection.jpg'],
    category: 'Shoes',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Folded Office Shirts Pack',
    price: 9999,
    quantity: 10,
    sold: 20,
    condition: ProductCondition.GOOD,
    published: true,
    images: ['/folded-shirts-blue.jpg'],
    category: 'Shirts',
    rating: 4.8
  }
];

const recentOrders: Partial<Order>[] = [
  {
    id: 'ORD-001',
    status: OrderStatus.PENDING,
    total: 47500,
    shippingCity: 'Yaba, Lagos',
    createdAt: new Date('2026-09-14'),
  },
  {
    id: 'ORD-002',
    status: OrderStatus.CONFIRMED,
    total: 32000,
    shippingCity: 'Garki, Abuja',
    createdAt: new Date('2026-09-14'),
  },
  {
    id: 'ORD-003',
    status: OrderStatus.SHIPPED,
    total: 15500,
    shippingCity: 'GRA, Port Harcourt',
    createdAt: new Date('2026-09-13'),
  },
  {
    id: 'ORD-004',
    status: OrderStatus.DELIVERED,
    total: 89000,
    shippingCity: 'Bodija, Ibadan',
    createdAt: new Date('2026-09-12'),
  },
];

const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString()}`;
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-amber-100 text-amber-900 border-amber-200';
    case OrderStatus.CONFIRMED:
      return 'bg-blue-100 text-blue-900 border-blue-200';
    case OrderStatus.SHIPPED:
      return 'bg-purple-100 text-purple-900 border-purple-200';
    case OrderStatus.DELIVERED:
      return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-900 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export default function SellerDashboardPage() {
  const allProducts = useAdminStore((s) => s.products);
  const fetchProducts = useAdminStore((s) => s.fetchProducts);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sellerListings = allProducts.length > 0
    ? allProducts.slice(0, 8)
    : (recentProducts as Product[]);

  const dynamicStats = [
    {
      label: 'Total Products',
      value: `${allProducts.length > 0 ? allProducts.length : 24}`,
      change: 'Verified on Ground',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Sales',
      value: '₦847,500',
      change: '+18.4% vs last mo',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Store Revenue',
      value: '₦2.4M',
      change: '+24.1% annualized',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Orders Processed',
      value: '156',
      change: '+12 dispatched today',
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
            Welcome back, {mockSellerName}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Your store is active. Here is your inventory and sales performance snapshot.
          </p>
        </div>
        <Link
          href="/products/new"
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
              <h2 className="text-base font-black text-gray-950">Active Inventory ({allProducts.length})</h2>
              <Link 
                href="/products/new" 
                className="text-xs font-bold text-[#c88d00] hover:underline"
              >
                + Add Listing
              </Link>
            </div>

            <div className="space-y-3">
              {sellerListings.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#fbf8f2] p-3.5 transition hover:border-[#FFD700]/30"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-950 text-sm truncate">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span className={`font-bold ${product.quantity === 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {product.quantity === 0 ? 'Out of stock' : `${product.quantity} in stock`}
                      </span>
                      <span>•</span>
                      <span>{product.sold} sold</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-sm font-black text-gray-950">
                      {formatCurrency(product.price!)}
                    </p>
                    <div className="flex gap-1.5">
                      <button 
                        className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 hover:text-black"
                        title="Edit product"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 hover:text-red-600"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sales Overview Column */}
        <section className="lg:col-span-1">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-black text-gray-950">Sales Performance</h2>
            
            {/* Chart Bars */}
            <div className="mb-5 flex h-40 items-end justify-around gap-2 rounded-2xl bg-[#fbf8f2] p-4">
              {[65, 45, 80, 55, 70, 95, 75].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#c88d00] to-[#FFD700] transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] font-bold text-gray-400">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-[#fbf8f2] p-3">
                <span className="font-semibold text-gray-600">This Week</span>
                <span className="font-black text-gray-900">₦124,500</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#fbf8f2] p-3">
                <span className="font-semibold text-gray-600">This Month</span>
                <span className="font-black text-gray-900">₦847,500</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#fbf8f2] p-3">
                <span className="font-semibold text-gray-600">Avg. Basket Size</span>
                <span className="font-black text-gray-900">₦5,433</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Orders Table */}
      <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-base font-black text-gray-950">Recent Customer Orders</h2>
          <span className="text-xs font-bold text-gray-500">Live escrow dispatch</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-left font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 font-mono font-bold text-gray-900">{order.id}</td>
                  <td className="py-3.5 text-gray-500">{formatDate(order.createdAt!)}</td>
                  <td className="py-3.5 text-gray-700">{order.shippingCity}</td>
                  <td className="py-3.5 font-black text-gray-950">{formatCurrency(order.total!)}</td>
                  <td className="py-3.5">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor(order.status!)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="font-bold text-[#c88d00] hover:underline">
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link 
          href="/products/new"
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

        <button 
          className="flex items-center gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#FFD700] hover:shadow-md text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-sm">Sales Analytics</h3>
            <p className="text-xs text-gray-500">View customer trends & traffic</p>
          </div>
        </button>

        <button 
          className="flex items-center gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#FFD700] hover:shadow-md text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-sm">Payout Settings</h3>
            <p className="text-xs text-gray-500">Manage Nigerian bank accounts</p>
          </div>
        </button>
      </div>
    </div>
  );
}
