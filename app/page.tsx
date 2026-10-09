'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { sampleProducts } from '@/lib/mockProducts';
import { useAdminStore } from '@/store/adminStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { ToastContainer } from '@/components/Toast';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag,
  Ruler,
  CheckCircle2,
  Store,
  DollarSign,
  Gift,
  Heart,
  Palette,
  Truck,
  Scissors,
  Crown,
  Calculator,
  RefreshCw,
  Tag,
  Check,
  ChevronRight
} from 'lucide-react';
import { Product } from '@/types';

// Visual Category Tiles representing ground inventory + special features using authentic flyer assets
const visualCategories = [
  {
    title: 'Electronics & Gadgets',
    caption: 'MacBooks, ANC wireless earbuds & tech gear',
    image: '/banner-electronics.jpg',
    href: '/products?category=Gadgets',
    count: '350+ units',
    tag: 'Tested Tech'
  },
  {
    title: 'Phones & iPhones',
    caption: 'Certified iPhones, Samsung Galaxy & Androids',
    image: '/banner-phones.jpg',
    href: '/products?category=Phones',
    count: '240+ phones',
    tag: 'Real Value'
  },
  {
    title: 'Aso Ebi Made Easy',
    caption: 'Swiss voile lace, velvet sequin & Agbada sets',
    image: '/banner-aso-ebi.jpg',
    href: '#aso-ebi',
    count: 'Bulk Orders',
    tag: 'Wedding Ready'
  },
  {
    title: 'YabaRight Gift Shop',
    caption: 'Custom jerseys, mugs, tees, caps & phone cases',
    image: '/banner-gift-shop.jpg',
    href: '/gift-shop',
    count: '9 Gift Items',
    tag: 'Personalized'
  },
  {
    title: 'Super Combo Deal',
    caption: 'Complete 3-piece fit: Shirt, Jeans & Shoes',
    image: '/banner-super-combo.jpg',
    href: '/products?category=Combos',
    count: '₦25,000 Set',
    tag: 'Hot Deal'
  },
  {
    title: 'Suits & Blazers',
    caption: 'Tailored 2-piece suits, blazers & silk ties',
    image: '/banner-suit-tie.jpg',
    href: '/products?category=Suits',
    count: 'Below ₦30k',
    tag: 'Grade A'
  },
  {
    title: 'Chop Corporate Shoes',
    caption: 'Genuine leather Oxfords, loafers & sneakers',
    image: '/banner-corporate-shoes.jpg',
    href: '/products?category=Shoes',
    count: '₦22,999 Only',
    tag: 'Verified Leather'
  },
  {
    title: 'Casual & Office Shirts',
    caption: 'Crisp button-ups, breathable cotton & stripes',
    image: '/banner-casual-shirts.jpg',
    href: '/products?category=Shirts',
    count: 'From ₦9,999',
    tag: 'Daily Steals'
  },
];

// Interactive Gift Customization Studio Items
interface GiftOption {
  id: string;
  type: string;
  title: string;
  tagline: string;
  price: number;
  originalPrice: number;
  image: string;
  defaultText: string;
  placeholder: string;
  productId: string;
  colorOptions: string[];
  mockupBadgeStyle: string;
}

const GIFT_OPTIONS: GiftOption[] = [
  {
    id: 'jersey',
    type: 'Jersey',
    title: 'Customized Club / Country Jersey',
    tagline: 'Custom back name & squad number print with official sports vinyl',
    price: 12500,
    originalPrice: 20000,
    image: '/custom-jersey.jpg',
    defaultText: 'ADEBAYO 10',
    placeholder: 'E.g. KANU 4, BABA 01, OMA 7',
    productId: 'prod-20',
    colorOptions: ['Forest Green', 'Royal Blue', 'Classic White', 'Crimson Red'],
    mockupBadgeStyle: 'font-mono uppercase font-black tracking-widest text-[#FFD700]',
  },
  {
    id: 'mug',
    type: 'Mug',
    title: 'Custom Photo & Personal Message Mug',
    tagline: 'High-gloss 11oz ceramic mug with heat-sealed personal quote or photo',
    price: 4500,
    originalPrice: 7500,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    defaultText: 'BEST DAD IN LAGOS',
    placeholder: 'E.g. QUEEN OF MY HEART, DR. TUNDE',
    productId: 'prod-21',
    colorOptions: ['Pure White', 'Matte Black', 'Gold Rim'],
    mockupBadgeStyle: 'font-serif italic font-bold tracking-wide text-white drop-shadow-md',
  },
  {
    id: 'tshirt',
    type: 'Tshirt',
    title: 'Personalized Heavyweight Cotton Graphic Tee',
    tagline: '240GSM combed cotton with high-definition DTF durable graphic print',
    price: 7999,
    originalPrice: 12000,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    defaultText: 'BLESSED & FOCUSED',
    placeholder: 'E.g. BIG WINS ONLY, 1994 VINTAGE',
    productId: 'prod-22',
    colorOptions: ['Onyx Black', 'Vintage Cream', 'Steel Grey'],
    mockupBadgeStyle: 'font-sans uppercase font-black tracking-tight text-white',
  },
  {
    id: 'caps',
    type: 'Caps',
    title: 'Custom Monogram Embroidered Cap',
    tagline: 'Structured 6-panel streetwear snapback with 3D puff embroidery',
    price: 6500,
    originalPrice: 10000,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    defaultText: 'LAGOS 26',
    placeholder: 'E.g. LAX, KING, INITIALS (J.O)',
    productId: 'prod-23',
    colorOptions: ['Midnight Black', 'Desert Khaki', 'Navy'],
    mockupBadgeStyle: 'font-mono uppercase font-black tracking-widest text-[#FFD700]',
  },
  {
    id: 'phone_case',
    type: 'Phone case',
    title: 'Personalized Shockproof Phone Case',
    tagline: 'Military-grade drop protection with laser-sharp monogram & raised bezel',
    price: 4999,
    originalPrice: 8500,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    defaultText: 'AMINAT K.',
    placeholder: 'E.g. DR. CHIMA, INITIALS, FAVORITE VERSE',
    productId: 'prod-24',
    colorOptions: ['Clear Hybrid', 'Matte Carbon', 'Frosted Smoke'],
    mockupBadgeStyle: 'font-sans font-bold tracking-wider text-[#FFD700]',
  },
  {
    id: 'folder',
    type: 'Folder',
    title: 'Executive Debossed Leather Document Folder',
    tagline: 'Vegan PU leather conference folio with engraved metallic nameplate',
    price: 9500,
    originalPrice: 16000,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    defaultText: 'BARR. TUNDE JOHNSON',
    placeholder: 'E.g. DR. CHIOMA & ASSOCIATES',
    productId: 'prod-25',
    colorOptions: ['Classic Black', 'Cognac Brown', 'Navy Blue'],
    mockupBadgeStyle: 'font-serif uppercase font-semibold tracking-widest text-[#FFD700]',
  },
  {
    id: 'books',
    type: 'Books',
    title: 'Gold-Foil Hardcover Journal & Book Gift Set',
    tagline: '200 lined gold-edged pages with foil-stamped name and silk bookmark',
    price: 5500,
    originalPrice: 9000,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    defaultText: 'BOOK OF PURPOSE 2026',
    placeholder: 'E.g. JOURNAL OF GRATITUDE, FAITH DIARY',
    productId: 'prod-26',
    colorOptions: ['Emerald Green', 'Royal Navy', 'Burgundy Wine'],
    mockupBadgeStyle: 'font-serif italic font-bold tracking-wider text-[#FFD700]',
  },
  {
    id: 'pen',
    type: 'Pen',
    title: 'Laser-Engraved Executive Gold-Trim Pen',
    tagline: 'Brass weighted ballpoint pen with 24K gold accents and velvet gift box',
    price: 4500,
    originalPrice: 7500,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    defaultText: 'DR. BOLANLE S.',
    placeholder: 'E.g. HON. BABAJIDE, ENGR. OLA',
    productId: 'prod-27',
    colorOptions: ['Matte Black & Gold', 'Gloss Silver & Gold', 'Pure Gold Tone'],
    mockupBadgeStyle: 'font-serif italic font-bold tracking-widest text-[#FFD700]',
  },
  {
    id: 'bracelets',
    type: 'Bracelets',
    title: 'Custom Name Magnetic Couple Charm Bracelets',
    tagline: 'Dual matte onyx & howlite stone beads with engraved stainless steel charms',
    price: 5999,
    originalPrice: 9500,
    image: 'https://images.unsplash.com/photo-1611591475837-7f8976b97664?auto=format&fit=crop&w=800&q=80',
    defaultText: 'CHIDI ♡ IFEOMA',
    placeholder: 'E.g. FOREVER & ALWAYS, A & M',
    productId: 'prod-28',
    colorOptions: ['Duo Onyx & Howlite', 'Triple Black Stone', 'Rose Quartz & Onyx'],
    mockupBadgeStyle: 'font-sans font-black tracking-widest text-[#FFD700]',
  },
];

export default function Home() {
  const categoryHeadingRef = useRef<HTMLDivElement>(null);
  const editorialSectionRef = useRef<HTMLDivElement>(null);

  const adminProducts = useAdminStore((state) => state.products);
  const addItemToCart = useCartStore((state) => state.addItem);
  const { showToast } = useToastStore();

  const [mounted, setMounted] = useState(false);

  // Interactive Gift Customization Studio State
  const [selectedGiftIndex, setSelectedGiftIndex] = useState(0);
  const [customText, setCustomText] = useState(GIFT_OPTIONS[0].defaultText);
  const [selectedColor, setSelectedColor] = useState(GIFT_OPTIONS[0].colorOptions[0]);
  const [recipientNote, setRecipientNote] = useState('');
  const [isAddingGift, setIsAddingGift] = useState(false);

  // Aso Ebi Bulk Calculator State
  const [asoEbiGuests, setAsoEbiGuests] = useState(20);
  const [asoEbiFabricTier, setAsoEbiFabricTier] = useState<'swiss' | 'velvet' | 'agbada'>('swiss');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update default custom text and color when switching gift item
  const handleSelectGift = (index: number) => {
    setSelectedGiftIndex(index);
    setCustomText(GIFT_OPTIONS[index].defaultText);
    setSelectedColor(GIFT_OPTIONS[index].colorOptions[0]);
  };

  const currentGift = GIFT_OPTIONS[selectedGiftIndex];

  // Handle adding customized gift directly to cart
  const handleAddCustomGift = () => {
    setIsAddingGift(true);
    const catalog = mounted && adminProducts ? adminProducts : sampleProducts;
    const baseProduct = catalog.find((p) => p.id === currentGift.productId) || {
      id: currentGift.productId,
      sellerId: 'admin-official',
      name: currentGift.title,
      description: currentGift.tagline,
      category: 'Gift Items',
      price: currentGift.price,
      originalPrice: currentGift.originalPrice,
      images: [currentGift.image],
      condition: 'NEW' as any,
      quantity: 50,
      sold: 10,
      rating: 4.9,
      trending: true,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const customizedProduct: Product = {
      ...baseProduct,
      id: `${baseProduct.id}-cust-${Date.now()}`,
      name: `${currentGift.title} (Customized: "${customText || currentGift.defaultText}")`,
      description: `Custom text: "${customText || currentGift.defaultText}". Color: ${selectedColor}. Note: ${recipientNote || 'None'}. ${baseProduct.description}`,
      price: currentGift.price,
    };

    addItemToCart(customizedProduct, 1);
    showToast(`Added customized ${currentGift.type} to your bag!`);

    setTimeout(() => {
      setIsAddingGift(false);
    }, 600);
  };

  // Curated Featured Drop products from live adminStore
  const displayProducts = mounted && adminProducts ? adminProducts : sampleProducts;
  const featuredDropProducts = displayProducts.slice(0, 8);
  const asoEbiProducts = displayProducts.filter((p) => p.category === 'Aso Ebi').slice(0, 4);

  // Aso Ebi Calculator Estimates
  const fabricPricePerCut = asoEbiFabricTier === 'swiss' ? 34500 : asoEbiFabricTier === 'velvet' ? 28000 : 32000;
  const bulkDiscountPercent = asoEbiGuests >= 50 ? 20 : asoEbiGuests >= 25 ? 15 : asoEbiGuests >= 10 ? 10 : 0;
  const standardTotal = fabricPricePerCut * asoEbiGuests;
  const finalTotal = standardTotal * (1 - bulkDiscountPercent / 100);
  const savings = standardTotal - finalTotal;

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#111111]">
      <Navbar />

      <main className="flex-1 pb-16 lg:pb-0">
        
        {/* ================= 1. FASHION-EDITORIAL HERO CAROUSEL ================= */}
        <HeroCarousel />

        {/* Quick Discovery Navigation Strip (Ground Inventory + Gifts + Aso Ebi) */}
        <div className="border-y border-[#FFD700]/20 bg-[#0e0e0e] py-3">
          <div className="container-custom">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {[
                { name: 'All Marketplace', href: '/products' },
                { name: '⚡ Electronics', href: '/products?category=Gadgets', highlight: true },
                { name: '📱 Phones', href: '/products?category=Phones', highlight: true },
                { name: '👑 Aso Ebi Made Easy', href: '#aso-ebi', highlight: true },
                { name: '🎁 Gift Shop', href: '/gift-shop', highlight: true },
                { name: '🔥 Super Combo Deal', href: '/products?category=Combos', highlight: true },
                { name: '👔 Suits & Blazers', href: '/products?category=Suits' },
                { name: '👞 Footwear', href: '/products?category=Shoes' },
                { name: '👕 Casual & Office Shirts', href: '/products?category=Shirts' },
                { name: '👖 Jeans & Trousers', href: '/products?category=Jeans' },
                { name: '👟 Sneakers & Trainers', href: '/products?category=Sneakers' },
                { name: '🔄 Trade / Swap', href: '/products?category=Trade' },
                { name: '💰 Affiliate Hub', href: '/affiliate' },
              ].map((pill) => (
                <Link
                  key={pill.name}
                  href={pill.href}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider transition-all ${
                    pill.highlight 
                      ? 'border-[#FFD700] bg-[#FFD700] text-black hover:bg-white hover:text-black shadow-md' 
                      : 'border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700] hover:text-black'
                  }`}
                >
                  {pill.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PROMOTIONAL FLYER: GIFT SHOP CAMPAIGN ================= */}
        <section className="py-6 sm:py-8 bg-[#fffaf0]">
          <div className="container-custom">
            <Link
              href="/gift-shop"
              className="group relative block overflow-hidden rounded-3xl border-2 border-[#FFD700] bg-gradient-to-r from-[#0d0d0d] via-[#161616] to-[#0a0a0a] p-5 sm:p-8 text-white shadow-2xl transition-all duration-300 hover:shadow-[#FFD700]/20 hover:border-white"
            >
              {/* Flyer Background Glow & Graphic Elements */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FFD700]/15 blur-3xl group-hover:bg-[#FFD700]/25 transition" />
              <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#e8941f]/15 blur-3xl" />
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Authentic Flyer Showcase Thumbnail */}
                <div className="w-full lg:w-48 flex-shrink-0 flex justify-center">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-[#FFD700]/40 bg-black shadow-2xl group-hover:scale-105 transition-transform duration-300 max-w-[200px]">
                    <img 
                      src="/banner-gift-shop.jpg" 
                      alt="YabaRight Gift Shop Official Flyer" 
                      className="w-full h-auto object-cover max-h-56"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-[#FFD700] px-2 py-0.5 text-[9px] font-black uppercase text-black">
                      Flyer
                    </div>
                  </div>
                </div>

                {/* Flyer Left Badge & Copy */}
                <div className="max-w-2xl flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-md">
                      <Gift className="h-3.5 w-3.5" />
                      <span>Official Gift Shop Flyer</span>
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#FFD700] border border-white/10">
                      ⚡ Customize Any Item • Instant Invoices
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                    SEND A GIFT TO <span className="text-[#FFD700]">SOMEONE SPECIAL TODAY</span>
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Thoughtful gifts. Lasting memories. Branded T-Shirts, Mugs, Phone Cases, Diaries & Notebooks, Couple Bracelets, Caps, Keychains, and Phone Stands. Add custom names, generate instant proforma invoices, and dispatch nationwide!
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5 text-[#FFD700]">
                      <CheckCircle2 className="h-4 w-4" /> Live Inscription Preview
                    </span>
                    <span className="flex items-center gap-1.5 text-[#FFD700]">
                      <CheckCircle2 className="h-4 w-4" /> Downloadable Proforma Invoices
                    </span>
                    <span className="flex items-center gap-1.5 text-[#FFD700]">
                      <CheckCircle2 className="h-4 w-4" /> Doorstep Delivery
                    </span>
                  </div>
                </div>

                {/* Flyer Right CTA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 flex-shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition group-hover:bg-white shadow-xl shadow-[#FFD700]/25">
                    <span>Open Gift Studio & Invoice</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>

              </div>
            </Link>
          </div>
        </section>

        {/* ================= 2. VISUAL CATEGORY DISCOVERY SECTION ================= */}
        <section id="categories" className="py-12 sm:py-16 lg:py-20">
          <div className="container-custom">
            
            {/* Section Header */}
            <div ref={categoryHeadingRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                  Visual Discovery
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">
                  Explore Curated Categories On Ground
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-xl">
                  Electronics, phones, custom gifts, Aso Ebi, suits, shoes & combo deals verified on ground.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#111111] hover:text-[#c88d00] transition group self-start sm:self-auto"
              >
                <span>View Full Directory</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Visual Category Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
              {visualCategories.map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD700]/60 hover:shadow-xl"
                >
                  {/* Category Image with Gradient */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Bottom Title & Piece Count */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h3 className="text-xs sm:text-sm font-black text-white leading-snug drop-shadow-sm">
                        {cat.title}
                      </h3>
                      <p className="mt-0.5 text-[10px] font-bold text-[#FFD700]">
                        {cat.count}
                      </p>
                    </div>
                  </div>

                  {/* Micro caption */}
                  <div className="p-2.5 bg-white">
                    <p className="line-clamp-1 text-[11px] text-gray-500 font-medium">
                      {cat.caption}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 3. DEDICATED FEATURE: CUSTOMIZE AND GIFT TO YOUR LOVED ONES ================= */}
        <section id="custom-gifts" className="relative overflow-hidden py-14 sm:py-20 lg:py-24 bg-[#0e0e0e] text-white border-y border-[#FFD700]/30 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#FFD700]/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#e8941f]/10 blur-3xl" />

          <div className="container-custom relative z-10">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#FFD700] mb-3">
                <Gift className="h-4 w-4" />
                <span>Personalized Keepsakes & Gifts</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                CUSTOMIZE AND GIFT TO <span className="text-[#FFD700]">YOUR LOVED ONES</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Add recipient names, squad numbers, monograms, anniversary dates, or heartfelt messages to jerseys, mugs, t-shirts, caps, phone cases, leather folders, books, engraved pens & charm bracelets.
              </p>
            </div>

            {/* Gift Items Navigation Selector (9 items as requested) */}
            <div className="mb-8 sm:mb-12">
              <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 text-center mb-3">
                Select an item to personalize:
              </p>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-1 justify-start md:justify-center">
                {GIFT_OPTIONS.map((gift, idx) => {
                  const isSelected = selectedGiftIndex === idx;
                  return (
                    <button
                      key={gift.id}
                      onClick={() => handleSelectGift(idx)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 scale-105 ring-2 ring-white/20'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>{gift.type}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-black/40 text-[#FFD700]'}`}>
                        ₦{(gift.price / 1000).toFixed(1)}k
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Customization Studio Box */}
            <div className="rounded-3xl border border-[#FFD700]/30 bg-gradient-to-br from-[#171717] via-[#121212] to-[#0a0a0a] p-6 sm:p-10 lg:p-12 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Visual Mockup Preview (6 cols) */}
                <div className="lg:col-span-6 relative flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl border-2 border-white/10 bg-black/80 shadow-2xl group">
                    <img
                      src={currentGift.image}
                      alt={currentGift.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Live Custom Text Mockup Stamp */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                      <div className="rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-5 py-3 shadow-2xl max-w-[85%] animate-in fade-in zoom-in-95 duration-300">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-0.5">
                          Personalized Custom Preview
                        </p>
                        <p className={`text-lg sm:text-2xl font-black drop-shadow-lg ${currentGift.mockupBadgeStyle}`}>
                          {customText || currentGift.defaultText}
                        </p>
                        <p className="text-[9px] text-gray-300 font-semibold mt-1">
                          Color: {selectedColor}
                        </p>
                      </div>
                    </div>

                    {/* Top Tag Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="rounded-full bg-[#FFD700] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                        {currentGift.type}
                      </span>
                      <span className="rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white border border-white/20">
                        Live Preview
                      </span>
                    </div>

                    {/* Bottom Price Bar */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/70 backdrop-blur-sm px-4 py-2 border border-white/10">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Item Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-black text-[#FFD700]">
                            ₦{currentGift.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ₦{currentGift.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Custom Print Included
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-gray-400 text-center">
                    ✨ High-precision laser etching, DTF print & vinyl customization guaranteed.
                  </p>
                </div>

                {/* Customization Options Form (6 cols) */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FFD700] mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Personalize Your Item</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {currentGift.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-300">
                    {currentGift.tagline}
                  </p>

                  <div className="mt-6 space-y-4">
                    
                    {/* Custom Text Input */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                        Name, Monogram or Custom Message:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={32}
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder={currentGift.placeholder}
                          className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-sm font-bold text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                        />
                        <span className="absolute right-3 top-3 text-[10px] font-mono font-bold text-gray-400">
                          {customText.length}/32
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400">
                        Type what you want printed or engraved on the {currentGift.type}.
                      </p>
                    </div>

                    {/* Color / Variant Selection */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                        Choose Color / Finish:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {currentGift.colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                              selectedColor === color
                                ? 'bg-[#FFD700] text-black font-black ring-2 ring-white/20'
                                : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/15 hover:text-white'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recipient Special Note */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                        Gift Card Note (Optional):
                      </label>
                      <input
                        type="text"
                        maxLength={60}
                        value={recipientNote}
                        onChange={(e) => setRecipientNote(e.target.value)}
                        placeholder="E.g. Happy 30th Birthday Chidi! Love, Amaka"
                        className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-xs font-medium text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                      />
                    </div>

                    {/* Guarantees Checklist */}
                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD700]" />
                        <span>Pre-shipment photo approval</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD700]" />
                        <span>Luxury gift-ready packaging</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD700]" />
                        <span>Fast Lagos & nationwide delivery</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD700]" />
                        <span>Durable fade-proof quality</span>
                      </div>
                    </div>

                    {/* Add to Bag CTA Button */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddCustomGift}
                        disabled={isAddingGift}
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-xl shadow-[#FFD700]/20 disabled:opacity-50"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>
                          {isAddingGift ? 'Adding to Bag...' : `Add Customized ${currentGift.type} to Bag (₦${currentGift.price.toLocaleString()})`}
                        </span>
                      </button>

                      <Link
                        href="/products?category=Gift+Items"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-5 py-4 text-xs font-bold text-white transition hover:border-[#FFD700] hover:text-[#FFD700]"
                      >
                        <span>View All 9 Gifts</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Quick 9-Item Grid Showcase */}
            <div className="mt-12 sm:mt-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Explore All Personalized Gift Options
                  </h3>
                  <p className="text-xs text-gray-400">
                    Handmade & customized in Lagos for your special occasions.
                  </p>
                </div>
                <Link
                  href="/products?category=Gift+Items"
                  className="text-xs font-black uppercase text-[#FFD700] hover:underline inline-flex items-center gap-1"
                >
                  <span>See Full Gift Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
                {GIFT_OPTIONS.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleSelectGift(index);
                      // Smooth scroll into studio view
                      const el = document.getElementById('custom-gifts');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`group flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                      selectedGiftIndex === index
                        ? 'border-[#FFD700] bg-[#FFD700]/15 shadow-md ring-1 ring-[#FFD700]'
                        : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                    }`}
                  >
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl bg-black mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <span className="text-xs font-black text-white leading-tight">
                      {item.type}
                    </span>
                    <span className="mt-1 text-[11px] font-bold text-[#FFD700]">
                      ₦{(item.price / 1000).toFixed(1)}k
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ================= 4. DEDICATED FEATURE: ASO EBI MADE EASY ================= */}
        <section id="aso-ebi" className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#fffaf0] via-[#fbf5e6] to-[#fffaf0] border-b border-black/10">
          <div className="container-custom">
            
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#c88d00]/30 bg-[#FFD700]/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#8a6000] mb-3">
                  <Crown className="h-4 w-4 text-[#8a6000]" />
                  <span>Owambe & Wedding Coordination</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#111111] leading-tight">
                  ASO EBI <span className="text-[#c88d00]">MADE EASY</span>
                </h2>
                <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                  Planning a Nigerian wedding, burial, or milestone owambe? Say goodbye to stressful fabric sourcing, short yards, and chasing guests for pick-up. We supply verified 5-yard cuts, pre-tied auto-gele & Agbada sets with direct doorstep delivery across all 36 states.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products?category=Aso+Ebi"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0b0b0b] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black hover:scale-105 active:scale-95 shadow-md"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop Aso Ebi Catalog</span>
                </Link>

                <a
                  href="https://wa.me/2349060755247?text=Hello%20YabaRight,%20I%20saw%20your%20Aso%20Ebi%20flyer%20and%20want%20to%20order%20for%20my%20event!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-5 py-3.5 text-xs font-black uppercase tracking-wider text-[#111111] hover:bg-[#FFD700] hover:text-black transition"
                >
                  <span>WhatsApp: +234 906 075 5247</span>
                </a>
              </div>
            </div>

            {/* Official Aso Ebi Flyer Feature Spotlight */}
            <div className="mb-12 sm:mb-16 overflow-hidden rounded-3xl border border-[#c88d00]/30 bg-gradient-to-br from-[#141414] via-[#0d0d0d] to-[#141414] text-white p-6 sm:p-10 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-[#FFD700]/50 shadow-2xl group max-w-sm">
                    <img 
                      src="/banner-aso-ebi.jpg" 
                      alt="Best Plenty Aso Ebi Deals on YabaRight" 
                      className="w-full h-auto max-h-[380px] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-[#FFD700] px-3 py-1 text-[10px] font-black uppercase text-black shadow-md">
                      Official Aso Ebi Flyer
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FFD700] mb-3 self-start">
                    <Crown className="h-3.5 w-3.5" />
                    <span>Dress Together. Celebrate Together.</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white leading-tight">
                    BEST PLENTY <span className="text-[#FFD700]">ASO EBI DEALS</span> ON YABARIGHT
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Premium fabrics, wide range of owambe colors, and unmatchable group prices. From Swiss voile lace bundles and velvet sequin to luxury auto-gele headties and bespoke men&apos;s cashmere Agbada, get exact 5-yard cuts packed with zero short yard disappointment.
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Fabrics</p>
                      <p className="text-xs sm:text-sm font-black text-[#FFD700]">Premium Swiss & Velvet</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Guarantee</p>
                      <p className="text-xs sm:text-sm font-black text-[#FFD700]">Exact 5 Yards</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Dispatch</p>
                      <p className="text-xs sm:text-sm font-black text-[#FFD700]">Nationwide</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/products?category=Aso+Ebi"
                      className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 text-xs sm:text-sm font-black uppercase text-black hover:bg-white transition shadow-lg"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Shop The Look Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="https://wa.me/2349060755247?text=Hello%20YabaRight,%20I%20want%20to%20inquire%20about%20the%20Aso%20Ebi%20deals%20flyer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/15 transition"
                    >
                      <span>Direct WhatsApp +234 906 075 5247</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Core Value Propositions of Aso Ebi Made Easy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
              
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#FFD700] hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#8a6000] mb-4">
                  <Scissors className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-[#111111]">
                  Exact 5-Yard Guarantee
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  No short yards or disappointing cuts. Every fabric bundle is physically measured on cutting tables before dispatch so your tailor has complete fabric length.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#FFD700] hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#8a6000] mb-4">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-[#111111]">
                  Bulk Group Pricing
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Order 10+, 25+, or 50+ guest bundles and unlock up to 20% group volume discounts. Stretch your wedding budget while giving your guests luxury fabric.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#FFD700] hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#8a6000] mb-4">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-[#111111]">
                  Nationwide Guest Dispatch
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Provide your guest list addresses in Lagos, Abuja, Ibadan, Port Harcourt, or beyond. We individually pack, label, and deliver directly to each guest’s doorstep.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#FFD700] hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#8a6000] mb-4">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-[#111111]">
                  Curated Color Harmony
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Swiss voile lace, velvet sequin, auto-gele pre-tied headties, and men&apos;s cashmere Agbada dyed to match your exact wedding color palette seamlessly.
                </p>
              </div>

            </div>

            {/* Aso Ebi Featured Bundles Grid */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                    Curated Aso Ebi Fabric Sets
                  </h3>
                  <p className="text-xs text-gray-600">
                    Inspected Grade A lace, voile & headtie combinations ready for event dispatch.
                  </p>
                </div>
                <Link
                  href="/products?category=Aso+Ebi"
                  className="text-xs font-black uppercase text-[#8a6000] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Aso Ebi</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {asoEbiProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Interactive Group Order & Yardage Calculator Card */}
            <div className="rounded-3xl border border-black/10 bg-[#0e0e0e] text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#FFD700] mb-3">
                    <Calculator className="h-3.5 w-3.5" />
                    <span>Instant Wedding Group Estimator</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Calculate Group Budget & Savings
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-300">
                    See how much your wedding or family committee saves when buying Aso Ebi in bulk from YabaRight.
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Guest Count Slider / Buttons */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-gray-300">Number of Guests / Bundles:</span>
                        <span className="text-[#FFD700] font-black text-sm">{asoEbiGuests} Bundles (5-Yards Each)</span>
                      </div>
                      <div className="flex gap-2">
                        {[10, 20, 35, 50, 100].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setAsoEbiGuests(num)}
                            className={`flex-1 rounded-xl py-2 text-xs font-black transition ${
                              asoEbiGuests === num
                                ? 'bg-[#FFD700] text-black shadow-md'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fabric Type Selector */}
                    <div>
                      <span className="block text-xs font-bold text-gray-300 mb-2">Fabric Quality Selection:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'swiss', label: 'Swiss Voile Lace', price: 34500 },
                          { id: 'velvet', label: 'Velvet Sequin Lace', price: 28000 },
                          { id: 'agbada', label: 'Men Cashmere Agbada', price: 32000 },
                        ].map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => setAsoEbiFabricTier(tier.id as any)}
                            className={`p-2.5 rounded-xl border text-left transition ${
                              asoEbiFabricTier === tier.id
                                ? 'border-[#FFD700] bg-[#FFD700]/20 text-white'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            <p className="text-[11px] font-black">{tier.label}</p>
                            <p className="text-[10px] text-[#FFD700] font-bold">₦{tier.price.toLocaleString()}/cut</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Card */}
                <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-black tracking-widest text-[#FFD700]">Bulk Estimate Breakdown</span>
                    <div className="mt-4 space-y-2 text-xs text-gray-300 pb-4 border-b border-white/10">
                      <div className="flex justify-between">
                        <span>Total Yardage ({asoEbiGuests} × 5 yds):</span>
                        <strong className="text-white">{asoEbiGuests * 5} Yards</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard Individual Retail:</span>
                        <span className="text-gray-400 line-through">₦{standardTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Group Volume Discount ({bulkDiscountPercent}%):</span>
                        <span>-₦{savings.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-sm font-black text-white">Estimated Group Total:</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#FFD700]">
                        ₦{finalTotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 text-right">
                      *Includes individual guest packaging & door dispatch support
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/2348000000000?text=Hello%20YabaRight,%20I%20want%20to%20order%20${asoEbiGuests}%20bundles%20of%20Aso%20Ebi%20(${asoEbiFabricTier})%20with%20bulk%20pricing!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <span>Lock In Group Pricing on WhatsApp</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                      href="/products?category=Aso+Ebi"
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-bold text-white transition hover:bg-white/20"
                    >
                      <span>View Fabrics</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ================= 5. FEATURED DROP: VERIFIED FRESH INVENTORY ================= */}
        <section id="featured-drop" className="border-t border-black/5 bg-white py-12 sm:py-16 lg:py-20">
          <div className="container-custom">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#a06f00] mb-2">
                  <Sparkles className="h-3 w-3 text-[#c88d00]" />
                  <span>Verified Fresh Inventory</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">
                  Featured Ground Inventory Drops
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-xl">
                  Sneakers, trainers, corporate trousers, tech gadgets, laptops & fresh thrift arrivals.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b0b0b] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black hover:scale-105 active:scale-95 shadow-md self-start sm:self-auto"
              >
                <span>Shop All Drops</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Product Cards Grid */}
            {featuredDropProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {featuredDropProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-12 text-center">
                <p className="text-sm font-bold text-gray-500">No products available in this drop right now.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-2.5 text-xs font-black uppercase text-black hover:bg-[#ffcc00] transition"
                >
                  Browse Full Catalog
                </Link>
              </div>
            )}

            {/* Bottom Section Link */}
            <div className="mt-10 sm:mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border-2 border-black/10 bg-[#fffaf0] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#111111] transition hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-black shadow-sm"
              >
                <span>Browse All 5,000+ Verified Fits</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* ================= 6. EDITORIAL COLLECTION FEATURE ================= */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#f5f0e8]/60 border-t border-black/5">
          <div className="container-custom">
            <div 
              ref={editorialSectionRef}
              className="overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 bg-[#0e0e0e] text-white shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                
                {/* Large Editorial Fashion Image (7 cols) */}
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] w-full overflow-hidden bg-black">
                  <img
                    src="/banner-suit-tie.jpg"
                    alt="The Executive & Vintage Edit"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0e0e0e]" />
                  
                  {/* Floating Collection Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-[#FFD700] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg">
                      Editorial Curated Drop
                    </span>
                  </div>
                </div>

                {/* Editorial Collection Copy & Action (5 cols) */}
                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD700]">
                    The Style Standard
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                    The Executive & Vintage Edit
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Designed for Nigerian professionals and sharp dressers who value poise over hype. Featuring tailored two-piece blazers, Italian-cut cotton shirts, and verified silk ties that let you make an entrance without emptying your savings.
                  </p>

                  {/* Curated Highlights */}
                  <div className="mt-5 space-y-2 text-xs text-gray-300 font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
                      <span>Verified Grade A Thrift & Brand New sets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
                      <span>Full shirt & silk tie combos under ₦15,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
                      <span>Exact measurements listed for accurate fit</span>
                    </div>
                  </div>

                  {/* Primary & Secondary Actions */}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href="/products?category=Shirts"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Shop Shirts & Ties</span>
                    </Link>

                    <Link
                      href="/products?category=Trade"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 text-xs font-bold text-white transition hover:border-[#FFD700] hover:text-[#FFD700]"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-[#FFD700]" />
                      <span>Trade-In Thrift Wardrobe</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= 7. "WHY YABARIGHT" TRUST SECTION ================= */}
        <section id="why-yabaright" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-black/5">
          <div className="container-custom">
            
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                Marketplace Trust Standard
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">
                Why Shop YabaRight?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Online thrift shopping and custom gift ordering shouldn&apos;t feel like a gamble. We built three core standards into every transaction so you shop with 100% peace of mind.
              </p>
            </div>

            {/* 3 Core Trust Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Pillar 1: Product Condition Grading */}
              <div className="flex flex-col rounded-2xl border border-black/10 bg-[#fffaf0] p-6 sm:p-8 shadow-sm transition hover:border-[#FFD700]/50 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#a06f00] mb-5">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111]">
                  Clear Condition Grading
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  No misleading photos or hidden defects. We strictly evaluate and label every piece: <strong className="text-black">Brand New</strong>, <strong className="text-black">Thrift Grade A (Mint / Like New)</strong>, or <strong className="text-black">Thrift Grade B</strong>. Flaws, collar conditions, and fabric weights are explicitly noted.
                </p>
                <div className="mt-4 pt-4 border-t border-black/5 text-[11px] font-black uppercase tracking-wider text-[#c88d00]">
                  5-Star Quality Standards
                </div>
              </div>

              {/* Pillar 2: Sizing & Fit Guidance */}
              <div className="flex flex-col rounded-2xl border border-black/10 bg-[#fffaf0] p-6 sm:p-8 shadow-sm transition hover:border-[#FFD700]/50 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#a06f00] mb-5">
                  <Ruler className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111]">
                  Sizing & Fit Guidance
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Vintage and thrift sizing varies across American, UK, and European cuts. We take physical measurements of chest, waist, shoulder width, and inseam in inches and centimeters, comparing them with standard Nigerian body fits so your order fits right the first time.
                </p>
                <div className="mt-4 pt-4 border-t border-black/5 text-[11px] font-black uppercase tracking-wider text-[#c88d00]">
                  Accurate Measurements Guaranteed
                </div>
              </div>

              {/* Pillar 3: Seller Trust & Verification */}
              <div className="flex flex-col rounded-2xl border border-black/10 bg-[#fffaf0] p-6 sm:p-8 shadow-sm transition hover:border-[#FFD700]/50 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#a06f00] mb-5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111]">
                  Vetted Sellers & Buyer Escrow
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Every merchant undergoes phone and identity verification before listing. Payments are secured in automated escrow: your money is only released to the seller after the package is delivered and inspected.
                </p>
                <div className="mt-4 pt-4 border-t border-black/5 text-[11px] font-black uppercase tracking-wider text-[#c88d00]">
                  100% Protected Local Checkout
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 8. ABOUT US (WHO WE ARE!) SECTION ================= */}
        <section id="about-us" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#fffaf0] via-[#fbf5e6] to-[#fffaf0] border-t border-black/5">
          <div className="container-custom max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FFD700]/30 bg-[#0e0e0e] p-6 sm:p-10 md:p-14 text-white shadow-2xl">
              
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FFD700]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#e8941f]/10 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4">
                  <span>Our Heart & Mission</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
                  YABARIGHT <span className="text-[#FFD700]">WHO WE ARE!</span>
                </h2>

                <div className="mt-6 space-y-4 text-xs sm:text-sm leading-relaxed text-gray-300 font-medium">
                  <div className="rounded-xl border-l-4 border-[#FFD700] bg-white/5 p-4 text-gray-200">
                    <p className="text-sm sm:text-base font-bold text-[#FFD700]">
                      “Do I look good and take care of myself, or do I pay my children’s school fees?”
                    </p>
                  </div>

                  <p>
                    A time when a man begins sacrificing his youth, his confidence, his appearance, and the little things that once made him feel alive — all because he has a family to provide for.
                  </p>

                  <p className="text-white font-bold">
                    A man shouldn’t have to lose himself just to take care of the people he loves. The moment you stop looking good and having that confidence, something inside you begins to fade.
                  </p>

                  <p className="text-sm sm:text-base font-bold text-[#FFD700]">
                    That’s the emotion behind YabaRight. Look good. Earn more. Live better. ❤️
                  </p>

                  <p>
                    Through our marketplace and affiliate program, you can dress in Grade A fashion without spending a fortune, while earning commissions from products people buy every day.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <span>Shop Affordable Fits</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/affiliate"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white/20 hover:text-[#FFD700]"
                  >
                    <DollarSign className="h-4 w-4 text-[#FFD700]" />
                    <span>Join Affiliate & Earn</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 9. PROMINENT SELLER CTA BANNER ================= */}
        <section className="py-12 sm:py-16">
          <div className="container-custom">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FFD700] via-[#ffcc00] to-[#e8941f] p-8 sm:p-12 shadow-xl border border-black/10">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black mb-3">
                    <Store className="h-3.5 w-3.5" />
                    <span>Vendor Hub</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
                    Turn Your Closet into Daily Income
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-black/85 leading-relaxed">
                    Have quality sneakers, trainers, denim, corporate pant trousers, gadgets, or gift items? Join thousands of verified Nigerian vendors selling on YabaRight with nationwide delivery support.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-xl"
                  >
                    <span>Start Selling Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-black/20 bg-black/10 px-6 py-3.5 text-xs font-bold text-black transition hover:bg-black/20"
                  >
                    <span>Seller Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ================= 10. SIMPLIFIED FOOTER ================= */}
      <Footer />
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
