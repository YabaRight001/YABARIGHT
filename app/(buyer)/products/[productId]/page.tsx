'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProductById, sampleProducts } from '@/lib/mockProducts';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToastStore } from '@/store/toastStore';
import { useAffiliateStore } from '@/store/affiliateStore';
import { useAdminStore } from '@/store/adminStore';
import { ProductCard } from '@/components/ProductCard';
import { BodyTypeVisualizer } from '@/components/BodyTypeVisualizer';
import { ProductConditionGuideModal } from '@/components/ProductConditionGuideModal';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Share2,
  Check,
  CheckCircle2,
  Award,
  Store,
  Ruler,
  Info
} from 'lucide-react';

function ProductDetailContent({
  params,
}: {
  params: { productId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminProducts = useAdminStore((state) => state.products);
  const vendors = useAdminStore((state) => state.vendors);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use live products from adminStore once mounted
  const allProducts = mounted && adminProducts !== undefined ? adminProducts : sampleProducts;
  const product = allProducts.find((p) => p.id === params.productId);

  const isOfficial = product?.sellerId === 'admin-official';
  const vendor = vendors?.find((v) => v.id === product?.sellerId);
  const isVerified = isOfficial || (vendor?.isVerified ?? false);

  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const showToast = useToastStore((state) => state.showToast);
  const { setActiveRef } = useAffiliateStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : (product?.size || 'M')
  );
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showBodyGuide, setShowBodyGuide] = useState(false);
  const [showConditionGuide, setShowConditionGuide] = useState(false);

  // Capture affiliate ref from URL and persist it
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setActiveRef(ref.toUpperCase());
      if (typeof window !== 'undefined') {
        localStorage.setItem('yabaright_ref', ref.toUpperCase());
      }
    }
  }, [searchParams, setActiveRef]);

  if (!product) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-[2rem] border border-black/10 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
            📦
          </div>
          <h1 className="mt-4 text-2xl font-black text-gray-900">
            Item Not Found
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            This item may have been purchased by another thrifter or removed by the seller.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-[#111111] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black"
          >
            Explore Marketplace
          </Link>
        </div>
      </main>
    );
  }

  const isSaved = wishlistItems.includes(product.id);

  const handleWishlistToggle = () => {
    toggleItem(product.id);
    if (isSaved) {
      showToast('Removed from saved items', 'info');
    } else {
      showToast('Saved to your wishlist!', 'success');
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`Added ${quantity}x "${product.name}" (${selectedSize}) to your bag!`, 'success');
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/cart');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Product link copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const availableSizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ['Small', 'Medium', 'Large', 'XL', 'XXL', 'XXXL'];

  // Related products from live allProducts
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.trending))
    .slice(0, 4);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const currentImage = product.images[selectedImageIndex] || product.images[0];

  return (
    <div className="container-custom py-6 sm:py-10">
      {/* Breadcrumb & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:border-[#FFD700] hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:border-[#FFD700]"
          title="Share product link"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4 text-gray-600" />}
          <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share Fit'}</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left Column: Interactive Image Gallery */}
        <div className="space-y-4">
          {/* Main Hero Image */}
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#f7f5f0] shadow-sm">
            <img
              src={currentImage}
              alt={product.name}
              className="h-[440px] sm:h-[520px] w-full object-cover transition-all duration-300"
            />

            {/* Badges on Hero */}
            <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
              {product.trending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#FFD700] shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Trending Fit
                </span>
              )}
              {discountPercent && (
                <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Wishlist floating toggle */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
              aria-label="Save to wishlist"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Gallery Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#FFD700] ring-2 ring-[#FFD700]/40 scale-95'
                      : 'border-black/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Purchase */}
        <div className="flex flex-col">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#fff7d6] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#856404]">
                  {product.condition || 'Verified Thrift'}
                </span>

                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isOfficial ? 'YabaRight Official' : 'Verified Vendor'}
                  </span>
                )}
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {product.brand || product.category}
              </span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-black text-gray-950">
              {product.name}
            </h1>

            {/* Seller & Verification Trust Row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="ml-1 font-bold text-gray-900">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-medium">
                Seller: <strong className="text-gray-900">{vendor ? vendor.shopName : isOfficial ? 'YabaRight Direct' : 'Verified Merchant'}</strong>
              </span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-emerald-600">In Stock ({product.quantity} left)</span>
            </div>

            {/* Price section */}
            <div className="mt-5 flex items-baseline gap-3 border-y border-gray-100 py-4">
              <span className="text-3xl font-black text-gray-950">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-semibold text-gray-400 line-through">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Specifications Matrix Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-xl border border-black/5 bg-[#fbf8f2] p-3 text-center">
                <p className="font-bold text-gray-400 uppercase text-[10px]">Gender</p>
                <p className="mt-1 font-black text-gray-900">{product.gender || 'Unisex'}</p>
              </div>
              {product.neckSize && (
                <div className="rounded-xl border border-black/5 bg-[#fbf8f2] p-3 text-center">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Neck Size</p>
                  <p className="mt-1 font-black text-gray-900">{product.neckSize}</p>
                </div>
              )}
              {product.waistSize && (
                <div className="rounded-xl border border-black/5 bg-[#fbf8f2] p-3 text-center">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Trouser Waist</p>
                  <p className="mt-1 font-black text-gray-900">{product.waistSize}</p>
                </div>
              )}
              <div className="rounded-xl border border-black/5 bg-[#fbf8f2] p-3 text-center">
                <p className="font-bold text-gray-400 uppercase text-[10px]">Condition</p>
                <p className="mt-1 font-black text-gray-900">{product.condition}</p>
              </div>
              <div className="rounded-xl border border-black/5 bg-[#fbf8f2] p-3 text-center">
                <p className="font-bold text-gray-400 uppercase text-[10px]">Material</p>
                <p className="mt-1 font-black text-gray-900">{product.material || 'Premium'}</p>
              </div>
              <div className="rounded-xl border border-black/5 bg-[#fbf8f2] p-3 text-center">
                <p className="font-bold text-gray-400 uppercase text-[10px]">Brand</p>
                <p className="mt-1 font-black text-gray-900">{product.brand || 'Verified'}</p>
              </div>
            </div>

            {/* Size Selector with Body Visualizer Toggle */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-800">
                  Select Size (Small – XXXL):
                </label>
                <button
                  type="button"
                  onClick={() => setShowBodyGuide(!showBodyGuide)}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#c88d00] hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{showBodyGuide ? 'Hide Fit Guide' : 'AI Body Type Guide →'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-black uppercase transition-all ${
                      selectedSize === size
                        ? 'bg-[#111111] text-[#FFD700] ring-2 ring-[#FFD700] shadow-sm scale-105'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Body Type Guide Expandable Section */}
            {showBodyGuide && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <BodyTypeVisualizer
                  selectedBodyTypes={product.bodyTypeFit || ['Medium', 'Large']}
                  readOnly={true}
                />
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="mt-6 flex items-center gap-4">
              <label className="text-xs font-black uppercase tracking-wider text-gray-800">
                Quantity:
              </label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-[#fbf8f2] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-10 text-center text-xs font-black">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-black hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <ShoppingBag className="h-4 w-4 text-[#FFD700]" />
                <span>Add to Cart ({selectedSize})</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-[#FFD700] py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-[1.02] active:scale-95 shadow-md"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="mt-8 space-y-3 rounded-2xl border border-black/5 bg-[#fbf8f2] p-4 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-[#c88d00] flex-shrink-0" />
                <span>Dispatched within 24 hours across Lagos, Abuja & nationwide</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#c88d00] flex-shrink-0" />
                <span>Quality-checked thrift grade with authentic escrow checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-[#c88d00] flex-shrink-0" />
                <span>Standardized 5-Star condition grading on all fashion items</span>
              </div>
            </div>

            {/* ── PRODUCT CONDITION & TERMS NOTICE ── */}
            <div className="mt-5 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-[#fffdf5] p-4 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <Sparkles className="h-4 w-4 text-[#c88d00] flex-shrink-0" />
                <span>
                  Product condition ratings apply. Terms and conditions apply.{' '}
                  <button
                    type="button"
                    onClick={() => setShowConditionGuide(true)}
                    className="font-black text-[#c88d00] underline hover:text-black transition ml-1"
                  >
                    Read more here →
                  </button>
                </span>
              </div>
            </div>

            {/* Vendor Profile Card (Jiji Verified style) */}
            {vendor && (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-900 font-black">
                      <Store className="h-4 w-4 text-[#c88d00]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-black text-gray-900">{vendor.shopName}</p>
                        {vendor.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500">{vendor.address}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="font-black text-[#c88d00]">★ {vendor.rating}</span>
                    <span className="text-gray-400 block">{vendor.totalSales} sales</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-black/5 pt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                Similar Finds
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#111111]">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-gray-700 hover:text-[#c88d00]"
            >
              See All →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Product Condition Guide Modal Popup */}
      <ProductConditionGuideModal
        isOpen={showConditionGuide}
        onClose={() => setShowConditionGuide(false)}
      />
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-16 text-center text-xs font-bold text-gray-500">
          Loading product details...
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
