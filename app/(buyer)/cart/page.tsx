'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle2,
  Minus,
  Plus
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 35000;

export default function CartPage() {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCartStore();
  const showToast = useToastStore((state) => state.showToast);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'YABA10') {
      const discount = Math.round(total * 0.1);
      setDiscountAmount(discount);
      setPromoApplied(true);
      showToast('Promo code YABA10 applied! 10% off', 'success');
    } else if (promoCode.trim().toUpperCase() === 'FIRSTBUY') {
      const discount = 2000;
      setDiscountAmount(discount);
      setPromoApplied(true);
      showToast('Promo code FIRSTBUY applied! ₦2,000 off', 'success');
    } else {
      showToast('Invalid coupon code. Try "YABA10"', 'error');
    }
  };

  const handleRemove = (productId: string, name?: string) => {
    removeItem(productId);
    showToast(`Removed ${name || 'item'} from cart`, 'info');
  };

  const shippingCost = items.length === 0 ? 0 : total >= FREE_SHIPPING_THRESHOLD ? 0 : 2500;
  const tax = Math.round(total * 0.05);
  const finalTotal = Math.max(0, total - discountAmount + shippingCost + tax);
  const progressToFreeShipping = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  return (
    <div className="container-custom py-6 sm:py-10">
      {/* Title Bar */}
      <div className="mb-6 flex items-baseline justify-between border-b border-black/5 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
            Review & Cart
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black text-gray-950">
            Shopping Cart ({itemCount})
          </h1>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-gray-500 hover:text-red-600 transition"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-black/10 bg-white p-12 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-[#c88d00] mb-4">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Your cart is currently empty</h2>
          <p className="mt-2 max-w-sm text-xs text-gray-500">
            Looks like you haven&apos;t added any thrift finds yet. Discover fresh designer pieces and budget steals right now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?max_price=10000"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#fbf8f2] px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-800 transition hover:bg-gray-100"
            >
              <span>Deals Under ₦10K</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Items List */}
          <div className="space-y-4">
            {/* Free Shipping Progress Meter */}
            <div className="rounded-2xl border border-black/5 bg-[#fbf8f2] p-4 text-xs">
              <div className="flex items-center justify-between font-bold text-gray-800">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-[#c88d00]" />
                  {remainingForFreeShipping === 0
                    ? '🎉 You unlocked FREE Nationwide Delivery!'
                    : `Add ₦${remainingForFreeShipping.toLocaleString()} more for FREE Delivery!`}
                </span>
                <span className="text-[11px] text-gray-500">{progressToFreeShipping}%</span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD700] to-[#c88d00] transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            {items.map((item) => {
              const itemPrice = item.product?.price || 0;
              const itemTotal = itemPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm transition hover:border-[#FFD700]/30"
                >
                  <img
                    src={item.product?.images?.[0] || '/casual-shirts-colorful.jpg'}
                    alt={item.product?.name || 'Item'}
                    className="h-28 w-28 flex-shrink-0 rounded-2xl object-cover bg-gray-50"
                  />

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-black text-gray-950 text-base hover:text-[#c88d00] line-clamp-1"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {item.product?.condition || 'Thrift Grade'} • {item.product?.category}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId, item.product?.name)}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-xl border border-gray-200 bg-[#fbf8f2] p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-black text-gray-950">
                          ₦{itemTotal.toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-400">
                            ₦{itemPrice.toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm self-start">
            <h2 className="text-lg font-black text-gray-950">Order Summary</h2>

            {/* Promo Code Input */}
            <div className="mt-5 border-b border-gray-100 pb-5">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (try YABA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-[#fbf8f2] px-3.5 py-2 text-xs font-semibold uppercase text-gray-900 outline-none focus:border-[#FFD700]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#111111] px-4 py-2 text-xs font-black uppercase text-[#FFD700] hover:bg-black transition"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Discount of ₦{discountAmount.toLocaleString()} applied!</span>
                </div>
              )}
            </div>

            {/* Line items */}
            <div className="mt-5 space-y-3 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-bold text-gray-900">₦{total.toLocaleString()}</span>
              </div>

              {promoApplied && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Discount Applied
                  </span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-gray-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-black">FREE</span>
                  ) : (
                    `₦${shippingCost.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Lagos State VAT (5%)</span>
                <span className="font-bold text-gray-900">₦{tax.toLocaleString()}</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-gray-900">Total Due</span>
                <span className="text-2xl font-black text-[#c88d00]">
                  ₦{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD700] py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/products"
              className="mt-3 block text-center text-xs font-bold text-gray-500 hover:text-black"
            >
              ← Or continue shopping
            </Link>

            {/* Trust badge */}
            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#fbf8f2] p-3 text-[11px] text-gray-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Safe & Encrypted Checkout</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
