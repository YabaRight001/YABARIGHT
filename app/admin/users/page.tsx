'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useToastStore } from '@/store/toastStore';
import {
  Users,
  Search,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { users, deleteUser, setUserStatus } = useAdminStore();
  const showToast = useToastStore((s) => s.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'BUYER' | 'SELLER' | 'ADMIN'>('ALL');

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      deleteUser(id);
      showToast(`User account "${name}" has been deleted.`, 'info');
    }
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'flagged' : 'active';
    setUserStatus(id, nextStatus);
    showToast(`User "${name}" status updated to ${nextStatus}.`, 'success');
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          User & Seller Moderation
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review registered buyers, sellers, and admin accounts. Remove users not meeting platform standards.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFD700]"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'BUYER', 'SELLER'] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                roleFilter === role
                  ? 'bg-[#FFD700] text-black font-black'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : `${role}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#141414] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-400">
            Showing <strong className="text-white">{filteredUsers.length}</strong> Accounts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-400">
                <th className="pb-3">User Profile</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-[#FFD700]">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        u.role === 'SELLER'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : u.role === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 text-gray-300">
                    <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-gray-400" /> {u.email}</p>
                    <p className="flex items-center gap-1.5 mt-0.5 text-gray-400"><Phone className="h-3 w-3 text-gray-400" /> {u.phone}</p>
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {u.status === 'active' ? (
                        <><CheckCircle2 className="h-3 w-3" /> Standard Active</>
                      ) : (
                        <><AlertTriangle className="h-3 w-3" /> Flagged / Suspended</>
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 text-gray-400 font-mono text-[11px]">{u.joinedAt}</td>

                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                        className={`rounded-xl px-3 py-1 text-[11px] font-bold transition ${
                          u.status === 'active'
                            ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                            : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'active' ? 'Flag Account' : 'Reactivate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(u.id, u.name)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
