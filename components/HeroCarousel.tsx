'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag,
  Tag,
  Smartphone,
  Laptop,
  Crown,
  Gift,
  Zap,
  Flame,
  Shirt,
  Compass
} from 'lucide-react';

export interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  dealPrice: string;
  categoryName: string;
  tabLabel: string;
  iconName: string;
  image: string;
  targetHref: string;
  secondaryHref: string;
  callToAction: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: 'Tested Tech • 100% Genuine',
    title: 'Hottest Tech & Gadget Deals',
    subtitle: 'Refurbished Apple MacBooks, active noise-cancelling wireless earbuds, smartwatches & tech accessories verified by specialists.',
    dealPrice: 'From ₦100,000 (100k)',
    categoryName: 'Electronics & Gadgets',
    tabLabel: 'Electronics',
    iconName: 'Laptop',
    image: '/banner-electronics.jpg',
    targetHref: '/products?category=Gadgets',
    secondaryHref: '/products?category=Laptops',
    callToAction: 'Shop Electronics',
  },
  {
    id: 2,
    badge: 'Premium Phones • Real Value',
    title: 'Smartphones & Flagship iPhones',
    subtitle: 'Certified pre-owned and new iPhones, Samsung Galaxy & Android phones with verified battery health & 30-day warranty.',
    dealPrice: 'From ₦45,000',
    categoryName: 'Phones',
    tabLabel: 'Phones',
    iconName: 'Smartphone',
    image: '/banner-phones.jpg',
    targetHref: '/products?category=Phones',
    secondaryHref: '/products?category=Gadgets',
    callToAction: 'Shop Phones',
  },
  {
    id: 3,
    badge: 'Owambe Special • Bulk & Single Deals',
    title: 'Best Plenty Aso Ebi Deals',
    subtitle: 'Swiss voile lace, velvet sequin, auto-gele pre-tied headties & royal Agbada sets. Exact 5-yard guarantee with nationwide guest dispatch.',
    dealPrice: 'From ₦15,500',
    categoryName: 'Aso Ebi',
    tabLabel: 'Aso Ebi',
    iconName: 'Crown',
    image: '/banner-aso-ebi.jpg',
    targetHref: '/products?category=Aso+Ebi',
    secondaryHref: '#aso-ebi',
    callToAction: 'Shop Aso Ebi',
  },
  {
    id: 4,
    badge: 'Personalized • Thoughtful Keepsakes',
    title: 'Send A Gift To Someone Special',
    subtitle: 'Customized club jerseys, photo mugs, graphic tees, caps, phone cases, leather folders, books, engraved pens & charm bracelets.',
    dealPrice: 'From ₦4,500',
    categoryName: 'Gift Shop',
    tabLabel: 'Gift Shop',
    iconName: 'Gift',
    image: '/banner-gift-shop.jpg',
    targetHref: '/gift-shop',
    secondaryHref: '/products?category=Gift+Items',
    callToAction: 'Enter Gift Studio',
  },
  {
    id: 5,
    badge: '3-in-1 Fit • Head-to-Toe Deal',
    title: "Looking Good Shouldn't Kill",
    subtitle: 'Super combo deal! Complete 3-piece street fit: 1x button-down shirt, 1x straight-leg denim jeans, and 1x cushioned sneakers bundled together.',
    dealPrice: '₦25,000 Complete Combo',
    categoryName: 'Super Combo',
    tabLabel: 'Combo Deal',
    iconName: 'Flame',
    image: '/banner-super-combo.jpg',
    targetHref: '/products?category=Combos',
    secondaryHref: '/products?category=Clothing',
    callToAction: 'Grab Combo Deal',
  },
  {
    id: 6,
    badge: 'Executive Deal • Grade A Thrift',
    title: 'Look Rich. Spend Smart.',
    subtitle: 'Tailored two-piece suits, sharp blazers, and coordinated silk ties handpicked for Lagos professionals.',
    dealPrice: 'Below ₦30,000',
    categoryName: 'Suits & Blazers',
    tabLabel: 'Suits',
    iconName: 'Sparkles',
    image: '/banner-suit-tie.jpg',
    targetHref: '/products?category=Suits&max_price=30000',
    secondaryHref: '/products?category=Suits',
    callToAction: 'Shop Suits & Ties',
  },
  {
    id: 7,
    badge: 'Shoe Drop • Verified Leather',
    title: 'Great Fashion Within Reach',
    subtitle: 'Chop corporate leather Oxfords, comfortable commute loafers, and durable anti-slip soles for everyday hustle.',
    dealPrice: '₦22,999 Only',
    categoryName: 'Footwear',
    tabLabel: 'Shoes',
    iconName: 'Tag',
    image: '/banner-corporate-shoes.jpg',
    targetHref: '/products?category=Shoes&max_price=23000',
    secondaryHref: '/products?category=Shoes',
    callToAction: 'Shop Footwear',
  },
  {
    id: 8,
    badge: 'Workplace Edit • Office & Casuals',
    title: 'Look Sharp. Chop Casuals & Shirts',
    subtitle: 'Clean folded stacks of breathable cotton button-downs, crisp office shirts, and vibrant weekend chill wear.',
    dealPrice: 'Only ₦9,999',
    categoryName: 'Shirts & Casuals',
    tabLabel: 'Shirts',
    iconName: 'Shirt',
    image: '/banner-casual-shirts.jpg',
    targetHref: '/products?category=Shirts&max_price=10000',
    secondaryHref: '/products?category=Shirts',
    callToAction: 'Shop Shirts',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);

  // Progressive enhancement: dynamically load GSAP from CDN if not present locally
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).gsap) {
      setGsapReady(true);
      return;
    }

    const scriptId = 'gsap-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script.async = true;
      script.onload = () => setGsapReady(true);
      script.onerror = () => {
        setGsapReady(false);
      };
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', () => setGsapReady(true));
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Auto-advance timer (6 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Coordinated slide transition: Image first, then text
  useEffect(() => {
    const prefersReducedMotion = 
      typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gsap = (typeof window !== 'undefined' && (window as any).gsap) || null;

    if (prefersReducedMotion || !gsap || !textRef.current || !imageRef.current) {
      if (imageRef.current) {
        imageRef.current.style.opacity = '1';
        imageRef.current.style.transform = 'none';
      }
      if (textRef.current) {
        textRef.current.style.opacity = '1';
        textRef.current.style.transform = 'none';
      }
      return;
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    try {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      timelineRef.current = tl;

      // Image reveals first (0.45s), text seamlessly flows right after
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45 }
      ).fromTo(
        textRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 },
        '<0.1'
      );
    } catch {
      if (imageRef.current) imageRef.current.style.opacity = '1';
      if (textRef.current) textRef.current.style.opacity = '1';
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [current, gsapReady]);

  const activeSlide = heroSlides[current];

  // Helper icon renderer
  const renderTabIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="h-3.5 w-3.5" />;
      case 'Smartphone': return <Smartphone className="h-3.5 w-3.5" />;
      case 'Crown': return <Crown className="h-3.5 w-3.5" />;
      case 'Gift': return <Gift className="h-3.5 w-3.5" />;
      case 'Flame': return <Flame className="h-3.5 w-3.5" />;
      case 'Sparkles': return <Sparkles className="h-3.5 w-3.5" />;
      case 'Shirt': return <Shirt className="h-3.5 w-3.5" />;
      default: return <Tag className="h-3.5 w-3.5" />;
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-[#0b0b0b] pt-4 pb-8 sm:py-8 lg:py-12 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Flyers Hero Carousel"
    >
      {/* Background Ambience Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-48 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#FFD700]/10 blur-[130px]" 
      />

      <div className="container-custom relative z-10">
        
        {/* FAST FLYER SELECTOR TABS (Fastest links to banner products) */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 pb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#FFD700]" />
              Fast Category Flyer Links:
            </span>
            <span className="text-[10px] font-mono text-[#FFD700] font-bold">
              0{current + 1} / 0{heroSlides.length}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {heroSlides.map((slide, idx) => {
              const isActive = current === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/25 scale-105 ring-2 ring-[#FFD700]'
                      : 'border border-white/10 bg-white/5 text-gray-300 hover:border-[#FFD700]/50 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={`Jump to ${slide.tabLabel} flyer`}
                >
                  <span className={isActive ? 'text-black' : 'text-[#FFD700]'}>
                    {renderTabIcon(slide.iconName)}
                  </span>
                  <span>{slide.tabLabel}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN BANNER CONTAINER */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FFD700]/30 bg-gradient-to-br from-[#161616] via-[#101010] to-[#151515] p-4 sm:p-7 lg:p-10 shadow-2xl">
          
          {/*
            CRITICAL UX ENHANCEMENT:
            Image is rendered FIRST (order-1 on all screen sizes)!
            On Mobile: Flyer image is at the very top, immediately visible above fold.
            On Desktop: Flyer image is on the left (order-1, 7 cols), text/details on right (order-2, 5 cols).
            Reading left-to-right & top-to-bottom: IMAGE ALWAYS SHOWS FIRST!
          */}
          <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
            
            {/* 1. FLYER BANNER IMAGE (ORDER-1: ALWAYS FIRST!) */}
            <div 
              ref={imageRef} 
              className="lg:col-span-7 flex flex-col items-center justify-center order-1 transition-opacity duration-300"
            >
              <Link
                href={activeSlide.targetHref}
                className="group relative block w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl transition duration-300 hover:border-[#FFD700]/60 hover:shadow-[#FFD700]/10 hover:shadow-2xl"
              >
                <div className="relative flex items-center justify-center p-2 sm:p-3 bg-gradient-to-t from-black via-black/40 to-transparent min-h-[300px] sm:min-h-[400px] lg:min-h-[460px]">
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    fetchPriority="high"
                    decoding="async"
                    className="max-h-[340px] sm:max-h-[440px] md:max-h-[500px] lg:max-h-[530px] w-auto max-w-full rounded-xl object-contain shadow-2xl transition duration-500 group-hover:scale-[1.01]"
                  />

                  {/* Subtle Hover Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/40 rounded-xl backdrop-blur-[2px]">
                    <span className="flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-2xl transform transition-transform group-hover:scale-105">
                      <ShoppingBag className="h-4 w-4" />
                      <span>{activeSlide.callToAction}</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* 2. TEXT & CALL TO ACTION DETAILS (ORDER-2: SECOND IN FLOW) */}
            <div 
              ref={textRef} 
              className="lg:col-span-5 flex flex-col justify-center order-2 transition-opacity duration-300"
            >
              {/* Badge & Progress */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFD700]">
                  <Sparkles className="h-3.5 w-3.5 text-[#FFD700]" />
                  {activeSlide.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-gray-400">
                  0{current + 1} / 0{heroSlides.length}
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="mt-3 sm:mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl leading-[1.12]">
                {activeSlide.title}
              </h1>

              {/* Supporting Copy */}
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-gray-300 sm:text-base">
                {activeSlide.subtitle}
              </p>

              {/* DEAL PRICE CALLOUT */}
              <div className="mt-4 sm:mt-5 inline-flex items-center gap-2.5 self-start rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-2.5 shadow-md">
                <Tag className="h-4 w-4 text-[#FFD700]" />
                <span className="text-xs uppercase tracking-wider font-bold text-gray-300">Deal:</span>
                <span className="text-xl sm:text-2xl font-black text-[#FFD700]">
                  {activeSlide.dealPrice}
                </span>
              </div>

              {/* Primary & Secondary Actions */}
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={activeSlide.targetHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-xl shadow-[#FFD700]/20"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop This Drop</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={activeSlide.secondaryHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-3 sm:py-3.5 text-xs font-bold text-white transition hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-white/10"
                >
                  <span>Explore {activeSlide.categoryName}</span>
                </Link>
              </div>

              {/* Navigation Indicators & Prev / Next Controls */}
              <div className="mt-6 sm:mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrent(idx)}
                      aria-label={`Go to slide ${idx + 1}: ${slide.categoryName}`}
                      className={`h-2 transition-all rounded-full ${
                        current === idx 
                          ? 'w-7 sm:w-8 bg-[#FFD700]' 
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
