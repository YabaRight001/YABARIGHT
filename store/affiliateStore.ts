import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Affiliate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  socialHandle?: string;
  membershipTier?: 'Basic' | 'Bronze' | 'Pro';
  membershipFee?: number;
  isPaid?: boolean;
  paymentRef?: string;
  code: string;
  joinedAt: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
}

export interface Commission {
  id: string;
  affiliateCode: string;
  orderId: string;
  orderTotal: number;
  commissionAmount: number;
  customerName: string;
  status: 'pending' | 'paid';
  createdAt: string;
}

interface AffiliateState {
  affiliates: Affiliate[];
  commissions: Commission[];
  activeRef: string | null;
  registerAffiliate: (data: Omit<Affiliate, 'id' | 'code' | 'joinedAt' | 'totalEarnings' | 'pendingEarnings' | 'paidEarnings'>) => Affiliate;
  setActiveRef: (code: string) => void;
  clearActiveRef: () => void;
  recordCommission: (affiliateCode: string, orderId: string, orderTotal: number, customerName: string) => void;
  getAffiliateByCode: (code: string) => Affiliate | undefined;
  getAffiliateByEmail: (email: string) => Affiliate | undefined;
  getCommissionsForAffiliate: (code: string) => Commission[];
}

function generateCode(name: string): string {
  const prefix = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${suffix}`;
}

export const useAffiliateStore = create<AffiliateState>()(
  persist(
    (set, get) => ({
      affiliates: [],
      commissions: [],
      activeRef: null,

      registerAffiliate: (data) => {
        const existing = get().affiliates.find((a) => a.email === data.email);
        if (existing) return existing;
        const code = generateCode(data.fullName);
        const affiliate: Affiliate = {
          id: `aff-${Date.now()}`,
          ...data,
          code,
          joinedAt: new Date().toISOString(),
          totalEarnings: 0,
          pendingEarnings: 0,
          paidEarnings: 0,
        };
        set((state) => ({ affiliates: [...state.affiliates, affiliate] }));
        return affiliate;
      },

      setActiveRef: (code) => set({ activeRef: code }),
      clearActiveRef: () => set({ activeRef: null }),

      recordCommission: (affiliateCode, orderId, orderTotal, customerName) => {
        const commissionAmount = Math.round(orderTotal * 0.1);
        const commission: Commission = {
          id: `com-${Date.now()}`,
          affiliateCode,
          orderId,
          orderTotal,
          commissionAmount,
          customerName,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          commissions: [...state.commissions, commission],
          affiliates: state.affiliates.map((a) =>
            a.code === affiliateCode
              ? { ...a, totalEarnings: a.totalEarnings + commissionAmount, pendingEarnings: a.pendingEarnings + commissionAmount }
              : a
          ),
        }));
      },

      getAffiliateByCode: (code) => get().affiliates.find((a) => a.code === code),
      getAffiliateByEmail: (email) => get().affiliates.find((a) => a.email === email),
      getCommissionsForAffiliate: (code) => get().commissions.filter((c) => c.affiliateCode === code),
    }),
    { name: 'yabaright-affiliates' }
  )
);
