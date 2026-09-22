'use client';

import React from 'react';
import { X, Star, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, Info } from 'lucide-react';

interface ProductConditionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductConditionGuideModal({ isOpen, onClose }: ProductConditionGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-[2.5rem] border border-[#FFD700]/30 bg-[#141414] p-6 sm:p-8 text-white shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFD700]">
                Official Buyer Policy
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                PRODUCT CONDITION GUIDE
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/5 hover:bg-white/10 p-2 text-gray-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Introduction */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
          Please read carefully before purchasing any product. Our condition ratings help you understand the expected state of pre-owned products.
        </p>

        {/* 5-Star Ratings List */}
        <div className="space-y-3 mb-8">
          {/* 5 Star */}
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 transition hover:border-[#FFD700]/40">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                5 STAR — SUPER CLEAN
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Excellent condition with minimal or no visible signs of use.
            </p>
          </div>

          {/* 4 Star */}
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 transition hover:border-[#FFD700]/40">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-amber-400">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <Star className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-white">
                4 STAR — CLEAN
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Very good condition with minor signs of use.
            </p>
          </div>

          {/* 3 Star */}
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 transition hover:border-[#FFD700]/40">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-amber-400">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <Star className="h-4 w-4 text-gray-600" />
                <Star className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-gray-200">
                3 STAR — GOOD
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Good, usable condition with noticeable signs of previous use.
            </p>
          </div>

          {/* 2 Star */}
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 transition hover:border-[#FFD700]/40">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-amber-400">
                {[...Array(2)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <Star className="h-4 w-4 text-gray-600" />
                <Star className="h-4 w-4 text-gray-600" />
                <Star className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-gray-300">
                2 STAR — OK
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Presentable and usable, but not perfect. May have visible signs of use.
            </p>
          </div>

          {/* 1 Star */}
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 transition hover:border-[#FFD700]/40">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-600" />
                ))}
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                1 STAR — USABLE
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Functional and usable, but not in the best condition. Expect more noticeable signs of use.
            </p>
          </div>
        </div>

        {/* Important Refund Policy */}
        <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-5 mb-6">
          <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider mb-3">
            <AlertTriangle className="h-4 w-4" />
            <span>IMPORTANT REFUND POLICY</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-gray-200">
            <div>
              <p className="font-bold text-white mb-0.5">Pre-owned products:</p>
              <p className="text-gray-300">
                We do not offer refunds on pre-owned products. Please carefully review the product condition and rating before placing your order.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="font-bold text-white mb-0.5">Brand-new products:</p>
              <p className="text-gray-300">
                Refunds are available for brand-new products in accordance with our applicable return/refund terms.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-semibold text-gray-400 mb-6">
          Please read the product description and condition rating carefully before purchasing.
        </p>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-[#FFD700] py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] active:scale-98 shadow-lg shadow-[#FFD700]/20"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
}
