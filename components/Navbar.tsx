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

const navLinks = [
  { name: 'All Products', href: '/products' },
  { name: 'Thrift', href: '/products?category=thrift' },
  { name: 'New Arrivals', href: '/products?category=new' },
  { name: 'Hot Deals', href: '/products?category=deals' },
  { name: 'Shoes', href: '/products?category=shoes' },
  { name: 'Bags', href: '/products?category=bags' },
  { name: '💰 Earn with Us', href: '/affiliate' },
];

export function Navbar() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount);
  const wishlistCount = useWishlistStore((state) => state.itemCount);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#FFD700]/25 bg-[#0b0b0b]/95 backdrop-blur-md transition-all shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#FFD700] via-[#ffcc00] to-[#e8941f] px-4 py-1.5 text-center text-[11px] font-black uppercase tracking-wider text-black sm:text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-black" />
          <span>Pay Less, Look Rich — Authentic Thrift & Fresh Fits Across Nigeria</span>
          <span className="hidden md:inline">• Nationwide Delivery within 2-4 Days</span>
        </span>
      </div>

      {/* Main Header Row */}
      <div className="container-custom flex items-center justify-between py-3 sm:py-4">
        {/* Left: Mobile Menu Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-[#FFD700] hover:text-[#FFD700] md:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="YabaRight Logo"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 xl:gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-black uppercase tracking-wider text-white/80 transition hover:text-[#FFD700]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Search, Wishlist, Cart & Account Dropdown Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Toggle / Input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search shirts, shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-64 rounded-full border border-[#FFD700]/50 bg-[#1a1a1a] px-4 py-1.5 text-xs text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FFD700]/30"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-gray-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-[#FFD700]"
                aria-label="Open search"
                title="Search products"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-[#FFD700]"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full bg-[#FFD700] px-3.5 sm:px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 shadow-sm"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1 text-[10px] font-black text-[#FFD700]">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Account & Portals Dropdown Menu */}
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/90 transition hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-white/10"
              aria-expanded={accountMenuOpen}
              aria-label="Account menu"
            >
              <User className="h-3.5 w-3.5" />
              <span>Menu</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${accountMenuOpen ? 'rotate-180 text-[#FFD700]' : ''}`} />
            </button>

            {/* Desktop Dropdown Content */}
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#141414] p-2 text-white shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account & Portals</p>
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

                {/* Subtle Admin Link inside the menu */}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#FFD700]/20 bg-[#0f0f0f] px-5 py-6 lg:hidden animate-in slide-in-from-top duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-5">
            <input
              type="text"
              placeholder="Search thrift finds, bags, shoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#1c1c1c] px-4 py-3 pl-11 text-sm text-white placeholder-gray-400 outline-none focus:border-[#FFD700]"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2.5 top-2 rounded-xl bg-[#FFD700] px-3 py-1.5 text-xs font-bold text-black"
            >
              Search
            </button>
          </form>

          {/* Mobile Links */}
          <div className="space-y-2">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#FFD700]/70">
              Browse Categories
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-white/90 transition hover:bg-white/5 hover:text-[#FFD700]"
              >
                <span>{link.name}</span>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-white/15 py-2.5 text-sm font-bold text-white transition hover:bg-white/5"
              >
                Login to Account
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl bg-[#FFD700] py-2.5 text-sm font-black text-black transition hover:bg-[#ffcc00]"
              >
                Become a Seller
              </Link>
              {/* Discreet Admin Portal Link in Mobile Menu */}
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                <Shield className="h-3.5 w-3.5 text-gray-400" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
