'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';
import { useAdminStore } from '@/store/adminStore';
import { useToastStore } from '@/store/toastStore';
import { ProductCondition, type Product } from '@/types';
import { ArrowLeft, Upload, CheckCircle2, Sparkles, Camera } from 'lucide-react';

const initialState = {
  name: '',
  category: 'Clothing',
  price: '12000',
  description: '',
  condition: ProductCondition.GOOD,
  size: 'M',
  brand: '',
  image: '/casual-shirts-stack.jpg',
};

export default function NewProductPage() {
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const showToast = useToastStore((state) => state.showToast);
  const storedCategories = useAdminStore((state) => state.categories);
  const storedPresets = useAdminStore((state) => state.imagePresets);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories =
    storedCategories && storedCategories.length > 0
      ? storedCategories
      : ['Clothing', 'Bags', 'Shoes', 'Shirts', 'Suits', 'Accessories', 'Designer Items', 'Vintage', 'Traditional Wears'];

  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
      showToast('Photo loaded from your device! 📸', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sellerId: 'seller-current',
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      originalPrice: Number(form.price) + 6000,
      images: [form.image],
      size: form.size,
      condition: form.condition,
      material: 'Premium fabric',
      color: 'Neutral',
      brand: form.brand || 'Verified Thrift Seller',
      quantity: 5,
      sold: 0,
      rating: 4.8,
      trending: false,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProducts([...products, newProduct]);
    showToast(`"${form.name}" has been published to the marketplace!`, 'success');
    router.push('/dashboard');
  };

  return (
    <div className="container-custom py-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
            Vendor Listing Tool
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-gray-950">
            List a New Item
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:border-[#FFD700] hover:text-black transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2 text-xs">
          <div className="md:col-span-2">
            <label className="mb-1.5 block font-bold text-gray-700">Product Title</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Vintage Oversized Denim Jacket"
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20" 
            />
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-gray-700">Category</label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs outline-none focus:border-[#FFD700]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-gray-700">Listing Price (₦)</label>
            <input 
              type="number" 
              name="price" 
              value={form.price} 
              onChange={handleChange} 
              required 
              placeholder="12000"
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs outline-none focus:border-[#FFD700]" 
            />
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-gray-700">Item Condition</label>
            <select 
              name="condition" 
              value={form.condition} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs outline-none focus:border-[#FFD700]"
            >
              <option value={ProductCondition.NEW}>Brand New with Tags</option>
              <option value={ProductCondition.LIKE_NEW}>Thrift Grade A (Like New)</option>
              <option value={ProductCondition.GOOD}>Good (Lightly Pre-owned)</option>
              <option value={ProductCondition.FAIR}>Fair</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-gray-700">Size / Fit</label>
            <input 
              name="size" 
              value={form.size} 
              onChange={handleChange} 
              placeholder="e.g. M, L, 42, Free Size"
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs outline-none focus:border-[#FFD700]" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block font-bold text-gray-700">Brand / Designer</label>
            <input 
              name="brand" 
              value={form.brand} 
              onChange={handleChange} 
              placeholder="e.g. Zara, Nike, Thrift Boutique"
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs outline-none focus:border-[#FFD700]" 
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold text-gray-700">Product Image (Photo or URL)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c88d00] hover:text-black transition"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Upload from Device</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleDeviceUpload}
              className="hidden"
            />

            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input 
                  name="image" 
                  value={form.image} 
                  onChange={handleChange} 
                  placeholder="Paste image URL or click Upload"
                  className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 pl-10 text-xs outline-none focus:border-[#FFD700]" 
                />
                <Upload className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-black/10 bg-black/5 hover:bg-[#FFD700] hover:text-black px-4 py-3 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <Camera className="h-4 w-4" />
                <span>Choose File</span>
              </button>
              {form.image && (
                <div className="h-11 w-11 rounded-xl overflow-hidden border border-black/10 flex-shrink-0 bg-white">
                  <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block font-bold text-gray-700">Product Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              required 
              rows={4} 
              placeholder="Describe the fabric, fit, styling notes, and condition details..."
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs outline-none focus:border-[#FFD700]" 
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition shadow-md"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/dashboard')} 
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 py-3.5 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
