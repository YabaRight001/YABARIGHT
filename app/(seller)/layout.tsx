import Link from 'next/link';
import { ToastContainer } from '@/components/Toast';
import { Store, PlusCircle, ArrowLeftRight } from 'lucide-react';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#111111] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#FFD700]/30 bg-[#0b0b0b] shadow-lg">
        <div className="container-custom flex items-center justify-between py-3 sm:py-4">
          <Link href="/dashboard" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="YabaRight Logo" 
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-wider text-white/80 md:flex">
            <Link href="/dashboard" className="transition hover:text-[#FFD700]">
              Dashboard
            </Link>
            <Link href="/products/new" className="transition hover:text-[#FFD700]">
              Add Product
            </Link>
            <Link href="/products" className="transition hover:text-[#FFD700]">
              View Storefront
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/products/new"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#FFD700] px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00]"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>List Item</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white transition hover:border-[#FFD700] hover:text-[#FFD700]"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Buyer Mode</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">
        {children}
      </div>

      <ToastContainer />
    </div>
  );
}
