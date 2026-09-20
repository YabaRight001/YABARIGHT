'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useToastStore } from '@/store/toastStore';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Store,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdminVendorsPage() {
  const { vendors, verifyVendor, revokeVendor, deleteVendor } = useAdminStore();
  const showToast = useToastStore((s) => s.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');

  const handleVerify = (id: string, name: string) => {
    verifyVendor(id);
    showToast(`Vendor "${name}" is now VERIFIED! Badge awarded. ✓`, 'success');
  };

  const handleRevoke = (id: string, name: string) => {
    revokeVendor(id);
    showToast(`Verification badge revoked for "${name}".`, 'info');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete vendor "${name}" and all their products?`)) {
      deleteVendor(id);
      showToast(`Vendor "${name}" and their listings removed.`, 'info');
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.idNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'verified') return matchesSearch && v.isVerified;
    if (filterStatus === 'pending') return matchesSearch && !v.isVerified;
    return matchesSearch;
  });

  const verifiedCount = vendors.filter((v) => v.isVerified).length;
  const pendingCount = vendors.filter((v) => !v.isVerified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span>Vendor Verification Hub</span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-black text-emerald-400">
              Jiji Standard
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review vendor government IDs, CAC registrations, physical shop locations, and approve verified trust badges.
          </p>
        </div>
      </div>

      {/* Jiji Standard Banner */}
      <div className="rounded-[2rem] border border-[#FFD700]/25 bg-gradient-to-r from-[#1c1c1c] via-[#241f0a] to-[#1c1c1c] p-6 text-xs text-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFD700] text-black flex-shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-white text-sm">How Jiji-Style Verification Works on YabaRight</p>
            <p className="text-gray-400 mt-0.5">
              Verified vendors get a prominent green badge (<strong className="text-emerald-400">✓ Verified Vendor</strong>) on their product listings and shop cards, guaranteeing legitimate physical presence and identity verification to shoppers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 font-bold">
            {verifiedCount} Verified
          </span>
          <span className="rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 font-bold">
            {pendingCount} Pending Review
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search vendor, shop name, NIN/CAC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFD700]"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'verified'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                filterStatus === status
                  ? 'bg-[#FFD700] text-black font-black'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {status === 'pending' ? `Pending (${pendingCount})` : status === 'verified' ? `Verified (${verifiedCount})` : 'All Vendors'}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`rounded-[2rem] border p-6 transition shadow-sm ${
              vendor.isVerified
                ? 'border-emerald-500/30 bg-[#141814]'
                : 'border-amber-500/30 bg-[#181612]'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">{vendor.shopName}</h3>
                  {vendor.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-black text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Vendor
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black text-amber-400">
                      <ShieldAlert className="h-3 w-3" />
                      Pending KYC
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Proprietor: {vendor.name}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-[#FFD700] block">★ {vendor.rating}</span>
                <span className="text-[10px] text-gray-400">{vendor.totalSales} sales</span>
              </div>
            </div>

            {/* Vendor KYC Details */}
            <div className="mt-4 rounded-2xl bg-black/40 border border-white/5 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <FileCheck className="h-3.5 w-3.5 text-[#FFD700] flex-shrink-0" />
                <span className="text-gray-400">KYC Document:</span>
                <span className="font-bold text-white">{vendor.idType}</span>
                <span className="font-mono text-gray-400">({vendor.idNumber})</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                <span className="text-gray-400">Address:</span>
                <span className="text-gray-200 truncate">{vendor.address}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-gray-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-emerald-400" /> {vendor.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-blue-400" /> {vendor.email}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[10px] text-gray-400 font-mono">
                {vendor.verifiedAt ? `Verified on ${vendor.verifiedAt}` : `Registered ${vendor.joinedAt}`}
              </span>

              <div className="flex items-center gap-2">
                {vendor.isVerified ? (
                  <button
                    type="button"
                    onClick={() => handleRevoke(vendor.id, vendor.shopName)}
                    className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition flex items-center gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Revoke Badge</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleVerify(vendor.id, vendor.shopName)}
                    className="rounded-full bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black transition flex items-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve & Verify</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(vendor.id, vendor.shopName)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500 hover:text-white transition"
                  title="Delete vendor"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
