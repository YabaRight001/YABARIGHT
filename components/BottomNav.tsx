'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.itemCount);
  const wishlistCount = useWishlistStore((state) => state.itemCount);

  const navItems = [
    { label: 'Home', href: '/', icon: Home, match: pathname === '/' },
    { label: 'Shop', href: '/products', icon: Compass, match: pathname.startsWith('/products') },
    { 
      label: 'Saved', 
      href: '/wishlist', 
      icon: Heart, 
      match: pathname === '/wishlist',
      badge: wishlistCount 
    },
    { 
      label: 'Cart', 
      href: '/cart', 
      icon: ShoppingBag, 
      match: pathname === '/cart' || pathname === '/checkout',
      badge: itemCount 
    },
    { label: 'Account', href: '/login', icon: User, match: pathname === '/login' || pathname === '/register' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-[#0b0b0b]/95 backdrop-blur-md lg:hidden">
      <nav className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 transition ${
                isActive ? 'text-[#FFD700]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#FFD700] px-1 text-[9px] font-black text-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-[#FFD700]' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
