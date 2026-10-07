'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminStore, GiftItemPricing } from '@/store/adminStore';
import { useToastStore } from '@/store/toastStore';
import {
  Gift,
  Plus,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  FileText,
  ArrowUpRight,
  Edit2,
  Trash2,
  Tag,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export default function AdminGiftShopPage() {
  const { giftPricings, updateGiftPrice, addGiftPricing, deleteGiftPricing } = useAdminStore();
  const { showToast } = useToastStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBasePrice, setEditBasePrice] = useState<number>(0);
  const [editCustomFee, setEditCustomFee] = useState<number>(0);
  const [editDays, setEditDays] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Item Form State
  const [newItemType, setNewItemType] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemBasePrice, setNewItemBasePrice] = useState(5000);
  const [newItemCustomFee, setNewItemCustomFee] = useState(1000);
  const [newItemDays, setNewItemDays] = useState(2);
  const [newItemImage, setNewItemImage] = useState('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80');
  const [newItemDesc, setNewItemDesc] = useState('');

  const items = giftPricings || [];
  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (item: GiftItemPricing) => {
    setEditingId(item.id);
    setEditBasePrice(item.basePrice);
    setEditCustomFee(item.customizationFee);
    setEditDays(item.estimatedDays || 2);
  };

  const handleSavePrice = (id: string) => {
    if (editBasePrice <= 0) {
      showToast('Base price must be greater than zero', 'error');
      return;
    }
    updateGiftPrice(id, {
      basePrice: Number(editBasePrice),
      customizationFee: Number(editCustomFee),
      estimatedDays: Number(editDays),
    });
    setEditingId(null);
    showToast('Gift pricing updated successfully!', 'success');
  };

  const toggleAvailability = (item: GiftItemPricing) => {
    updateGiftPrice(item.id, { isAvailable: !item.isAvailable });
    showToast(
      `${item.type} is now ${!item.isAvailable ? 'available' : 'hidden'} in gift shop`,
      'info'
    );
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemType.trim() || !newItemName.trim()) {
      showToast('Please provide an item type and name', 'error');
      return;
    }

    const id = newItemType.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);
    const newItem: GiftItemPricing = {
      id,
      type: newItemType.trim(),
      name: newItemName.trim(),
      category: 'Gift Items',
      basePrice: Number(newItemBasePrice),
      customizationFee: Number(newItemCustomFee),
      estimatedDays: Number(newItemDays),
      image: newItemImage.trim(),
      description: newItemDesc.trim() || `Customizable ${newItemType.trim()} with custom inscription.`,
      isAvailable: true,
      colorOptions: ['Standard', 'Custom Color'],
      placeholderText: `E.g. CUSTOM ${newItemType.toUpperCase()}`,
      defaultText: `MY ${newItemType.toUpperCase()}`,
    };

    addGiftPricing(newItem);
    setShowAddModal(false);
    setNewItemType('');
    setNewItemName('');
    setNewItemDesc('');
    showToast(`Added new gift item: ${newItem.name}`, 'success');
  };

  // Calculations
  const avgPrice = items.length > 0 ? Math.round(items.reduce((acc, i) => acc + i.basePrice, 0) / items.length) : 0;
  const activeCount = items.filter((i) => i.isAvailable).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFD700] mb-2">
            <Gift className="h-3.5 w-3.5 text-[#FFD700]" />
            <span>Product Manager Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            Gift Shop Pricing & Inscription Control
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Set and modify merchandise base prices, custom inscription fees, and delivery timelines for all customizable gift items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gift-shop"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition"
          >
            <span>Live Buyer View</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFD700] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#e6c200] active:scale-95 shadow-md shadow-[#FFD700]/15"
          >
            <Plus className="h-4 w-4" />
            <span>Add Gift Item</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Available Gift Types</span>
            <Gift className="h-4 w-4 text-[#FFD700]" />
          </div>
          <p className="mt-3 text-2xl font-black text-white">{activeCount} / {items.length}</p>
          <p className="mt-1 text-[11px] text-emerald-400 font-semibold">Active in Storefront</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Avg Base Price</span>
            <DollarSign className="h-4 w-4 text-[#FFD700]" />
          </div>
          <p className="mt-3 text-2xl font-black text-white">₦{avgPrice.toLocaleString()}</p>
          <p className="mt-1 text-[11px] text-gray-400 font-medium">Across all categories</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Average Turnaround</span>
            <Clock className="h-4 w-4 text-[#FFD700]" />
          </div>
          <p className="mt-3 text-2xl font-black text-white">1 - 2 Days</p>
          <p className="mt-1 text-[11px] text-[#FFD700] font-medium">Production & Quality Check</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Proforma Invoices</span>
            <FileText className="h-4 w-4 text-[#FFD700]" />
          </div>
          <p className="mt-3 text-2xl font-black text-white">Automated</p>
          <p className="mt-1 text-[11px] text-emerald-400 font-medium">Instant PDF & WhatsApp</p>
        </div>
      </div>

      {/* Main Pricing Management Table */}
      <div className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black uppercase text-white">Product Manager Pricing Table</h2>
            <p className="text-xs text-gray-400">Edit base prices, engraving fees, or mark items unavailable.</p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search gift items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] font-black uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Item & Type</th>
                <th className="py-3 px-4">Base Price (₦)</th>
                <th className="py-3 px-4">Custom Inscription Fee (₦)</th>
                <th className="py-3 px-4">Total Unit Price (₦)</th>
                <th className="py-3 px-4">Turnaround</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-200 font-medium">
              {filteredItems.map((item) => {
                const isEditing = editingId === item.id;
                const totalItemPrice = (isEditing ? Number(editBasePrice) : item.basePrice) + (isEditing ? Number(editCustomFee) : item.customizationFee);

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition">
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl object-cover border border-white/10 bg-black flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#FFD700]/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#FFD700] border border-[#FFD700]/30">
                              {item.type}
                            </span>
                            <span className="font-black text-white text-xs">{item.name}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-gray-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Base Price */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-2 text-xs text-gray-400">₦</span>
                          <input
                            type="number"
                            min="500"
                            step="100"
                            value={editBasePrice}
                            onChange={(e) => setEditBasePrice(Number(e.target.value))}
                            className="w-full rounded-lg border border-[#FFD700] bg-black pl-6 pr-2 py-1.5 text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-white">₦{item.basePrice.toLocaleString()}</span>
                      )}
                    </td>

                    {/* Custom Fee */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-2 text-xs text-gray-400">₦</span>
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={editCustomFee}
                            onChange={(e) => setEditCustomFee(Number(e.target.value))}
                            className="w-full rounded-lg border border-[#FFD700] bg-black pl-6 pr-2 py-1.5 text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-gray-300">
                          {item.customizationFee > 0 ? `₦${item.customizationFee.toLocaleString()}` : 'Free'}
                        </span>
                      )}
                    </td>

                    {/* Total Calculated */}
                    <td className="py-3 px-4">
                      <span className="font-black text-[#FFD700] text-sm">
                        ₦{totalItemPrice.toLocaleString()}
                      </span>
                    </td>

                    {/* Turnaround */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={editDays}
                          onChange={(e) => setEditDays(Number(e.target.value))}
                          className="rounded-lg border border-[#FFD700] bg-black px-2 py-1.5 text-xs text-white"
                        >
                          <option value={1}>1 Day (Express)</option>
                          <option value={2}>2 Days</option>
                          <option value={3}>3 Days</option>
                          <option value={5}>5 Days</option>
                        </select>
                      ) : (
                        <span className="text-[11px] text-gray-300">
                          {item.estimatedDays || 2} {(item.estimatedDays || 2) === 1 ? 'Day' : 'Days'}
                        </span>
                      )}
                    </td>

                    {/* Availability */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase transition ${
                          item.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{item.isAvailable ? 'In Stock' : 'Paused'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSavePrice(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#FFD700] px-3 py-1.5 text-xs font-black text-black hover:bg-[#e6c200] transition"
                          >
                            <Save className="h-3.5 w-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-white/20 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/10 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>Set Price</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Gift Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#FFD700]/30 bg-[#141414] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#FFD700]" />
                <h3 className="text-lg font-black uppercase text-white">Add Customizable Gift Item</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-300 mb-1">Item Type Code:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Water Bottle"
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-300 mb-1">Display Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Custom Insulated Flask"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-300 mb-1">Base Price (₦):</label>
                  <input
                    type="number"
                    required
                    min="500"
                    value={newItemBasePrice}
                    onChange={(e) => setNewItemBasePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-300 mb-1">Custom Fee (₦):</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newItemCustomFee}
                    onChange={(e) => setNewItemCustomFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-300 mb-1">Turnaround:</label>
                  <select
                    value={newItemDays}
                    onChange={(e) => setNewItemDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#FFD700] focus:outline-none"
                  >
                    <option value={1}>1 Day</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-300 mb-1">Image URL:</label>
                <input
                  type="url"
                  required
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-300 mb-1">Description:</label>
                <textarea
                  rows={2}
                  placeholder="Describe material, print method, and customization limits..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFD700] px-5 py-2 text-xs font-black uppercase text-black hover:bg-[#e6c200] transition"
                >
                  Add to Gift Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
