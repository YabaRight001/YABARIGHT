'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  User, 
  Sparkles,
  ArrowRight,
  Shield,
  Store,
  DollarSign,
  ChevronDown
} from 'lucide-react';

const primaryNavLinks = [
  { name: 'Marketplace', href: '/products' },
  { name: 'Phones & Tech', href: '/products?category=Phones' },
  { name: '🎁 Gift Shop', href: '/gift-shop', highlight: true },
  { name: '👑 Aso Ebi', href: '/#aso-ebi', highlight: true },
  { name: 'Affiliate', href: '/affiliate' },
];

const categoryDropdownLinks = [
  { name: 'All Marketplace', href: '/products' },
  { name: 'Sneakers & Trainers', href: '/products?category=Sneakers' },
  { name: 'Suits & Blazers', href: '/products?category=Suits' },
  { name: 'Corporate Shoes', href: '/products?category=Shoes' },
  { name: 'Shirts & Polos', href: '/products?category=Shirts' },
  { name: 'Jeans & Trousers', href: '/products?category=Jeans' },
  { name: '🔥 Super Combo Deal', href: '/products?category=Combos' },
  { name: 'Trade / Swap', href: '/products?category=Trade' },
];

const discoveryLinks = [
  { name: 'All Products', href: '/products' },
  { name: 'Phones & Tech', href: '/products?category=Phones' },
  { name: 'Sneakers & Trainers', href: '/products?category=Sneakers' },
  { name: '🎁 Gift Shop', href: '/gift-shop', highlight: true },
  { name: '👑 Aso Ebi', href: '/#aso-ebi', highlight: true },
  { name: 'Suits & Shoes', href: '/products?category=Suits' },
  { name: 'Trade / Swap', href: '/products?category=Trade' },
  { name: 'Affiliate', href: '/affiliate' },
];

export function Navbar() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount);
  const wishlistCount = useWishlistStore((state) => state.itemCount);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target as Node)) {
        setCategoriesMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#FFD700]/20 bg-[#0b0b0b]/95 backdrop-blur-md transition-all shadow-md">
      {/* Top Value Announcement Bar */}
      <div className="bg-gradient-to-r from-[#FFD700] via-[#ffcc00] to-[#e8941f] px-4 py-1 text-center text-[11px] font-black uppercase tracking-wider text-black">
        <div className="container-custom flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-black flex-shrink-0" />
          <span className="truncate">NATIONWIDE DELIVERY 2-4 DAYS • VERIFIED THRIFT GRADE A & BRAND NEW</span>
          <span className="hidden lg:inline text-black/60 font-semibold">• SECURE PAYMENTS</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-6">
          
          {/* ================= ZONE 1: BRAND AREA (Desktop & Mobile) ================= */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile Menu Toggle - subtle fallback */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:border-[#FFD700] hover:text-[#FFD700] lg:hidden"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="YabaRight Logo"
                className="h-10 sm:h-12 w-auto object-contain transition group-hover:scale-102"
              />
            </Link>
          </div>

          {/* ================= ZONE 2: DISCOVERY AREA (Clean & Uncluttered for Laptop/Desktop) ================= */}
          <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 flex-1 px-2">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-black uppercase tracking-wider transition-colors py-1 whitespace-nowrap ${
                  link.highlight
                    ? 'text-[#FFD700] hover:text-[#ffcc00] flex items-center gap-1'
                    : 'text-white/80 hover:text-[#FFD700]'
                }`}
              >
                {link.highlight && <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />}
                {link.name}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesMenuRef}>
              <button
                type="button"
                onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
                className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-white/80 hover:text-[#FFD700] py-1 transition"
                aria-expanded={categoriesMenuOpen}
              >
                <span>Categories</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${categoriesMenuOpen ? 'rotate-180 text-[#FFD700]' : ''}`} />
              </button>

              {categoriesMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl border border-white/10 bg-[#141414] p-2 text-white shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Shop Categories</p>
                  </div>
                  <div className="space-y-0.5 py-1 text-xs">
                    {categoryDropdownLinks.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setCategoriesMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-1.5 font-bold text-gray-200 hover:bg-white/10 hover:text-[#FFD700] transition"
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ================= ZONE 3: UTILITY AREA (Right) ================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* Search Input / Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center animate-in fade-in zoom-in-95 duration-150">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search suits, shoes, bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-44 sm:w-64 rounded-full border border-[#FFD700]/50 bg-[#161616] px-4 py-1.5 text-xs text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FFD700]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2.5 text-gray-400 hover:text-white"
                    aria-label="Close search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-[#FFD700]"
                  aria-label="Search catalog"
                  title="Search products"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
            </div>

            {/* Wishlist Link with Live Counter (Desktop) */}
            <Link
              href="/wishlist"
              className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-[#FFD700]"
              aria-label="View Saved Wishlist"
              title="Saved items"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button Pill (Desktop & Mobile) */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#FFD700] px-3 sm:px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 shadow-sm active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Bag</span>
              {itemCount > 0 ? (
                <span className="flex h-4 min-w-[1.1rem] items-center justify-center rounded-full bg-black px-1 text-[9px] font-black text-[#FFD700]">
                  {itemCount}
                </span>
              ) : (
                <span className="hidden md:inline text-[10px] text-black/70 font-bold">0</span>
              )}
            </Link>

            {/* Account & Portals Dropdown (Desktop) */}
            <div className="relative hidden sm:block" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/90 transition hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-white/10"
                aria-expanded={accountMenuOpen}
                aria-label="Account and portals menu"
              >
                <User className="h-3.5 w-3.5" />
                <span>Account</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${accountMenuOpen ? 'rotate-180 text-[#FFD700]' : ''}`} />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#141414] p-2 text-white shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">YabaRight Portals</p>
                  </div>

                  <div className="space-y-1 py-1 text-xs">
                    <Link
                      href="/login"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold text-gray-200 hover:bg-white/10 hover:text-[#FFD700] transition"
                    >
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span>Buyer Login</span>
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold text-gray-200 hover:bg-white/10 hover:text-[#FFD700] transition"
                    >
                      <Store className="h-3.5 w-3.5 text-gray-400" />
                      <span>Become a Seller</span>
                    </Link>

                    <Link
                      href="/affiliate"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold text-gray-200 hover:bg-white/10 hover:text-[#FFD700] transition"
                    >
                      <DollarSign className="h-3.5 w-3.5 text-[#FFD700]" />
                      <span>Affiliate Program</span>
                    </Link>
                  </div>

                  <div className="border-t border-white/10 pt-1 mt-1">
                    <Link
                      href="/admin/login"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-400 hover:bg-[#FFD700]/10 hover:text-[#FFD700] transition"
                    >
                      <Shield className="h-3.5 w-3.5 text-gray-400" />
                      <span>Admin Portal</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Mobile Drawer (kept lean because BottomNav handles primary navigation) */}
      {mobileMenuOpen && (
        <div className="border-t border-[#FFD700]/20 bg-[#0f0f0f] px-5 py-5 lg:hidden animate-in slide-in-from-top duration-200">
          {/* Quick Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search thrift finds, bags, shoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFD700]"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </form>

          {/* Quick Category Discovery Links */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {discoveryLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 font-bold text-white/90 hover:bg-[#FFD700]/15 hover:text-[#FFD700] transition"
              >
                <span>{link.name}</span>
                <ArrowRight className="h-3 w-3 text-gray-500" />
              </Link>
            ))}
          </div>

          {/* Minimal Account & Seller Links */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-gray-300 hover:text-[#FFD700]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="font-black text-[#FFD700] hover:underline"
            >
              Sell on YabaRight →
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[11px] text-gray-500 hover:text-gray-300"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
