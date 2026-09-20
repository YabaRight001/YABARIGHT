'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useToastStore } from '@/store/toastStore';
import { ProductCondition } from '@/types';
import { BodyTypeVisualizer } from '@/components/BodyTypeVisualizer';
import {
  Package,
  PlusCircle,
  Trash2,
  Search,
  Filter,
  X,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Upload,
  Layers,
  Ruler,
  User,
} from 'lucide-react';

const CATEGORIES = ['Clothing', 'Shoes', 'Bags', 'Shirts', 'Suits', 'Trousers', 'Accessories'];

const ALL_SIZES = ['Small', 'Medium', 'Large', 'XL', 'XXL', 'XXXL'] as const;
const GENDERS = ['Male', 'Female', 'Unisex'] as const;
const COMMON_NECK_SIZES = ['14.5"', '15.0"', '15.5"', '16.0"', '16.5"', '17.0"', '17.5"', '18.0"'];
const COMMON_WAIST_SIZES = ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'];

const DEFAULT_IMAGE_PRESETS = [
  { label: 'Suit Blue', url: '/suit-blue-1.jpg' },
  { label: 'Suit Grey', url: '/suit-grey-1.jpg' },
  { label: 'Folded Shirts', url: '/folded-shirts-blue.jpg' },
  { label: 'Casual Shirts', url: '/casual-shirts-colorful.jpg' },
  { label: 'Leather Bag', url: '/bag-handbag.jpg' },
  { label: 'Corporate Shoes', url: '/male-shoes-collection.jpg' },
  { label: 'Jeans Stack', url: '/jeans-stack.jpg' },
  { label: 'Heels Black', url: '/heels-black-pair.jpg' },
  { label: 'Ballet Flats', url: '/female-shoe-flat.jpg' },
];

export default function AdminProductsPage() {
  const { products, addProduct, deleteProduct } = useAdminStore();
  const showToast = useToastStore((s) => s.showToast);

  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [form, setForm] = useState({
    name: '',
    category: 'Clothing',
    price: '',
    originalPrice: '',
    condition: ProductCondition.NEW,
    quantity: '10',
    selectedSizes: ['Medium', 'Large'] as ('Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL')[],
    gender: 'Unisex' as 'Male' | 'Female' | 'Unisex',
    neckSize: '15.5"',
    waistSize: '32"',
    bodyTypeFit: ['Medium', 'Large'] as ('Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL')[],
    brand: 'YabaRight Official',
    material: 'Premium Quality',
    description: '',
    imageUrl: '/suit-blue-1.jpg',
  });

  const toggleSize = (size: 'Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL') => {
    if (form.selectedSizes.includes(size)) {
      setForm({ ...form, selectedSizes: form.selectedSizes.filter((s) => s !== size) });
    } else {
      setForm({ ...form, selectedSizes: [...form.selectedSizes, size] });
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const priceNum = Number(form.price);
    const origPriceNum = form.originalPrice ? Number(form.originalPrice) : Math.round(priceNum * 1.5);
    const qtyNum = Number(form.quantity) || 1;

    addProduct({
      sellerId: 'admin-official',
      name: form.name,
      description: form.description,
      category: form.category,
      price: priceNum,
      originalPrice: origPriceNum,
      condition: form.condition,
      images: [form.imageUrl],
      size: form.selectedSizes.join(', ') || 'Standard',
      sizes: form.selectedSizes,
      gender: form.gender,
      neckSize: form.neckSize,
      waistSize: form.waistSize,
      bodyTypeFit: form.bodyTypeFit,
      brand: form.brand || 'YabaRight Official',
      material: form.material,
      quantity: qtyNum,
    });

    showToast(`Product "${form.name}" uploaded successfully! 🎉`, 'success');
    setModalOpen(false);
    setForm({
      name: '',
      category: 'Clothing',
      price: '',
      originalPrice: '',
      condition: ProductCondition.NEW,
      quantity: '10',
      selectedSizes: ['Medium', 'Large'],
      gender: 'Unisex',
      neckSize: '15.5"',
      waistSize: '32"',
      bodyTypeFit: ['Medium', 'Large'],
      brand: 'YabaRight Official',
      material: 'Premium Quality',
      description: '',
      imageUrl: '/suit-blue-1.jpg',
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? It will be removed from the catalog.`)) {
      deleteProduct(id);
      showToast(`Product "${name}" deleted from marketplace.`, 'info');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Product Management & Uploads
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Upload official YabaRight merchandise with AI body sizing guides or moderate substandard products.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-lg shadow-[#FFD700]/20"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Upload New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, ID, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFD700]"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-gray-400 font-bold hidden sm:inline">Category:</span>
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex-shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#FFD700] text-black font-black'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#141414] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} Products
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-400">
                <th className="pb-3">Item</th>
                <th className="pb-3">Seller / Source</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Sizes & Specs</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => {
                const isOfficial = p.sellerId === 'admin-official';
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0] || '/casual-shirts-colorful.jpg'}
                          alt={p.name}
                          className="h-12 w-12 rounded-xl object-cover bg-white/5 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      {isOfficial ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 px-2.5 py-0.5 text-[10px] font-black text-[#FFD700]">
                          <Sparkles className="h-3 w-3" /> YabaRight Official
                        </span>
                      ) : (
                        <span className="text-gray-300 font-mono">{p.sellerId}</span>
                      )}
                    </td>
                    <td className="py-3.5 text-gray-300">{p.category}</td>
                    <td className="py-3.5">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes && p.sizes.length > 0 ? (
                            p.sizes.map((s) => (
                              <span key={s} className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-black text-[#FFD700]">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-400">{p.size || 'Standard'}</span>
                          )}
                        </div>
                        {p.gender && (
                          <span className="text-[10px] text-gray-400">
                            {p.gender} {p.neckSize ? `• Neck: ${p.neckSize}` : ''} {p.waistSize ? `• Waist: ${p.waistSize}` : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <p className="font-black text-[#FFD700]">₦{p.price.toLocaleString()}</p>
                      {p.originalPrice && (
                        <p className="text-[10px] text-gray-500 line-through">
                          ₦{p.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 text-gray-300">{p.quantity} in stock</td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="rounded-xl bg-red-500/10 border border-red-500/20 p-2 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Delete product from catalog"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Comprehensive Upload Modal Form ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-[2.5rem] border border-[#FFD700]/30 bg-[#141414] p-6 sm:p-8 text-white shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFD700]/20 text-[#FFD700]">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Upload YabaRight Apparel & Goods</h2>
                  <p className="text-[11px] text-gray-400">Configure sizing, gender, measurements and AI body types</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* 1. Basic Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                  1. Product Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-gray-300">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Slim-Fit Executive Oxford Shirt"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1c1c1c]">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">Condition *</label>
                    <select
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value as ProductCondition })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                    >
                      <option value={ProductCondition.NEW} className="bg-[#1c1c1c]">Brand New</option>
                      <option value={ProductCondition.LIKE_NEW} className="bg-[#1c1c1c]">Like New / Grade A</option>
                      <option value={ProductCondition.GOOD} className="bg-[#1c1c1c]">Good Condition</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">Selling Price (₦) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 18500"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">Original / Slash Price (₦)</label>
                    <input
                      type="number"
                      placeholder="e.g. 28000"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">Stock Quantity</label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">Brand</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Sizing & Measurements Section */}
              <div className="rounded-2xl border border-white/10 bg-[#181818] p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-[#FFD700]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                    2. Sizes, Gender & Exact Measurements
                  </h3>
                </div>

                {/* Available Sizes Picker */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-gray-300">
                    Available Sizes (Select all that apply):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SIZES.map((size) => {
                      const active = form.selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
                            active
                              ? 'bg-[#FFD700] text-black shadow-md shadow-[#FFD700]/20 scale-105'
                              : 'border border-white/10 bg-black/40 text-gray-400 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gender & Measurements Grid */}
                <div className="grid gap-4 sm:grid-cols-3 pt-2">
                  {/* Gender */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">Target Gender</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {GENDERS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setForm({ ...form, gender: g })}
                          className={`rounded-xl py-2 text-[11px] font-bold transition ${
                            form.gender === g
                              ? 'bg-white text-black font-black'
                              : 'bg-black/40 border border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Neck Size */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">
                      Shirt / Neck Size
                    </label>
                    <select
                      value={form.neckSize}
                      onChange={(e) => setForm({ ...form, neckSize: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3 py-2 text-xs text-white outline-none focus:border-[#FFD700]"
                    >
                      <option value="">None / Not Applicable</option>
                      {COMMON_NECK_SIZES.map((n) => (
                        <option key={n} value={n} className="bg-[#1c1c1c]">{n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Trousers / Waist Size */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-300">
                      Trousers / Waist Size
                    </label>
                    <select
                      value={form.waistSize}
                      onChange={(e) => setForm({ ...form, waistSize: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3 py-2 text-xs text-white outline-none focus:border-[#FFD700]"
                    >
                      <option value="">None / Not Applicable</option>
                      {COMMON_WAIST_SIZES.map((w) => (
                        <option key={w} value={w} className="bg-[#1c1c1c]">Waist {w}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. AI Body Type Visualizer */}
              <div className="space-y-2">
                <BodyTypeVisualizer
                  selectedBodyTypes={form.bodyTypeFit}
                  onChange={(types) => setForm({ ...form, bodyTypeFit: types })}
                />
              </div>

              {/* 4. Images & Preset Picker */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300">Product Image Preset or URL</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {DEFAULT_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: preset.url })}
                      className={`rounded-xl border p-1 text-center transition flex flex-col items-center gap-1 ${
                        form.imageUrl === preset.url
                          ? 'border-[#FFD700] bg-[#FFD700]/15'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="h-10 w-10 object-cover rounded-lg" />
                      <span className="text-[10px] text-gray-300 truncate w-full">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="Or enter image URL"
                  className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2 text-xs text-white outline-none focus:border-[#FFD700]"
                />
              </div>

              {/* 5. Description */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-300">Product Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe condition, fabric, styling tips, and exact fit recommendations..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700]"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#FFD700] py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-lg shadow-[#FFD700]/15"
                >
                  Confirm & Publish to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
