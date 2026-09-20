'use client';

import Link from 'next/link';
import { Product, ProductCondition } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToastStore } from '@/store/toastStore';
import { useAdminStore } from '@/store/adminStore';
import { Heart, ShoppingBag, Star, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const showToast = useToastStore((state) => state.showToast);

  const isSaved = wishlistItems.includes(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    if (isSaved) {
      showToast('Removed from saved items', 'info');
    } else {
      showToast('Saved to your wishlist!', 'success');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    showToast(`Added "${product.name}" to bag!`, 'success');
  };

  // Calculate discount percentage if original price is present
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Format condition badge
  const getConditionBadge = (condition: ProductCondition | string) => {
    switch (condition) {
      case ProductCondition.NEW:
      case 'NEW':
      case 'New':
        return { label: 'Brand New', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case ProductCondition.LIKE_NEW:
      case 'LIKE_NEW':
      case 'Like New':
        return { label: 'Thrift Grade A', className: 'bg-[#fff7d6] text-[#856404] border-[#ffe885]' };
      default:
        return { label: 'Thrift Verified', className: 'bg-amber-50 text-amber-900 border-amber-200' };
    }
  };

  const conditionStyle = getConditionBadge(product.condition);
  const isVerified = useAdminStore((s) => s.isSellerVerified(product.sellerId));

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD700]/40 hover:shadow-xl">
      {/* Product Image Container */}
      <Link href={`/products/${product.id}`} className="relative block h-64 w-full overflow-hidden bg-[#f7f5f0]">
        <img
          src={product.images[0] || '/casual-shirts-stack.jpg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Floating Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              <CheckCircle2 className="h-3 w-3" />
              Verified Vendor
            </span>
          )}
          {product.trending && (
            <span className="inline-block rounded-full bg-[#111111] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#FFD700] shadow-sm">
              Trending 🔥
            </span>
          )}
          {discountPercent && (
            <span className="inline-block rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`}
          />
        </button>

        {/* Quick Add Overlay on hover (desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b0b0b]/90 py-2.5 text-xs font-black text-white backdrop-blur-sm transition hover:bg-black"
          >
            <ShoppingBag className="h-4 w-4 text-[#FFD700]" />
            <span>Quick Add to Bag</span>
          </button>
        </div>
      </Link>

      {/* Details Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Condition */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${conditionStyle.className}`}>
            {conditionStyle.label}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {product.brand || product.category}
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="mt-2.5 block">
          <h3 className="line-clamp-1 text-base font-black text-[#111111] transition group-hover:text-[#c88d00]">
            {product.name}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {product.description}
        </p>

        {/* Rating and Reviews */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-gray-800">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400 text-[11px]">{product.sold} sold</span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <div>
            <p className="text-lg font-black text-[#111111]">
              ₦{product.price.toLocaleString()}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-gray-400 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* Mobile Add to Bag / Desktop View Link */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex sm:hidden items-center gap-1.5 rounded-full bg-[#FFD700] px-3.5 py-1.5 text-xs font-black text-black transition hover:bg-[#ffcc00]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>

          <Link
            href={`/products/${product.id}`}
            className="hidden sm:inline-flex items-center rounded-full border border-black/10 bg-[#fbf8f2] px-3.5 py-1.5 text-xs font-bold text-gray-800 transition hover:bg-[#FFD700] hover:border-[#FFD700] hover:text-black"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
