'use client';

import Link from 'next/link';
import { sampleProducts } from '@/lib/mockProducts';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { ProductCard } from '@/components/ProductCard';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  const wishlistProducts = sampleProducts.filter((product) => items.includes(product.id));

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((p) => addItem(p, 1));
    showToast(`Added ${wishlistProducts.length} saved items to your bag!`, 'success');
  };

  return (
    <div className="container-custom py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-black/5 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
            Saved Collections
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black text-gray-950">
            My Wishlist ({wishlistProducts.length})
          </h1>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Move All to Cart</span>
            </button>
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-red-600 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-black/10 bg-white p-12 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 mb-4">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 max-w-sm text-xs text-gray-500">
            Tap the heart icon on any product in the marketplace to save pieces for later.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] shadow-md"
          >
            <span>Browse Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
