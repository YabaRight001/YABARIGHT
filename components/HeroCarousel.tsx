'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag,
  Tag
} from 'lucide-react';

export interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  dealPrice: string;
  categoryName: string;
  image: string;
  targetHref: string;
  secondaryHref: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: 'Executive Deal • Grade A Thrift',
    title: 'Look Rich. Spend Smart.',
    subtitle: 'Tailored two-piece suits, sharp blazers, and coordinated ties handpicked for Lagos professionals.',
    dealPrice: 'Below ₦30,000',
    categoryName: 'Suits & Blazers',
    image: '/banner-suit-tie.jpg',
    targetHref: '/products?category=suits&max_price=30000',
    secondaryHref: '/products?category=suits',
  },
  {
    id: 2,
    badge: 'Shoe Drop • Verified Leather',
    title: 'Great Fashion Within Reach.',
    subtitle: 'Classic leather Oxfords, comfortable commute loafers, and durable anti-slip soles.',
    dealPrice: '₦22,999 Only',
    categoryName: 'Footwear',
    image: '/banner-corporate-shoes.jpg',
    targetHref: '/products?category=shoes&max_price=23000',
    secondaryHref: '/products?category=shoes',
  },
  {
    id: 3,
    badge: 'Budget Steal • 100% Cotton',
    title: 'Look Sharp. Chop Casuals.',
    subtitle: 'Clean folded stacks of breathable cotton button-downs and vibrant weekend chill shirts.',
    dealPrice: 'Only ₦9,999',
    categoryName: 'Casual Shirts',
    image: '/banner-casual-shirts.jpg',
    targetHref: '/products?category=shirts&max_price=10000',
    secondaryHref: '/products?category=shirts',
  },
  {
    id: 4,
    badge: 'Workplace Edit • Office Grade',
    title: 'Look Good, Pay Less.',
    subtitle: 'Crisp formal office shirts, stiff collars, and classic stripes ready for your 9-to-5 hustle.',
    dealPrice: 'From ₦9,999',
    categoryName: 'Office Shirts',
    image: '/banner-office-shirts.jpg',
    targetHref: '/products?category=shirts&max_price=10000',
    secondaryHref: '/products?category=shirts',
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
        // Fallback gracefully to CSS transitions if CDN fails
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

  // Auto-advance timer (5.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Coordinated GSAP slide transition (under 1 second total, opacity, translate & subtle scale)
  useEffect(() => {
    const prefersReducedMotion = 
      typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gsap = (typeof window !== 'undefined' && (window as any).gsap) || null;

    if (prefersReducedMotion || !gsap || !textRef.current || !imageRef.current) {
      // Fallback: Ensure elements are immediately visible via direct CSS
      if (textRef.current) {
        textRef.current.style.opacity = '1';
        textRef.current.style.transform = 'none';
      }
      if (imageRef.current) {
        imageRef.current.style.opacity = '1';
        imageRef.current.style.transform = 'none';
      }
      return;
    }

    // Kill any active timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    try {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      timelineRef.current = tl;

      // Coordinated timeline:
      // Text: opacity 0 -> 1, translate-y 16px -> 0 (duration 0.45s)
      // Image: opacity 0 -> 1, translate-y 12px -> 0, subtle scale 1.03 -> 1.0 (duration 0.55s)
      // Overlap: <0.08s, total duration is ~0.65s (well under roughly 1s)
      // No character/word animations as requested
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45 }
      ).fromTo(
        imageRef.current,
        { opacity: 0, y: 12, scale: 1.03 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55 },
        '<0.08'
      );
    } catch {
      // Graceful fallback
      if (textRef.current) textRef.current.style.opacity = '1';
      if (imageRef.current) imageRef.current.style.opacity = '1';
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [current, gsapReady]);

  const activeSlide = heroSlides[current];

  return (
    <section
      className="relative overflow-hidden bg-[#0b0b0b] py-6 sm:py-8 lg:py-12 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Fashion Editorial Hero Carousel"
    >
      {/* Background Ambience Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-48 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#FFD700]/10 blur-[120px]" 
      />

      <div className="container-custom relative z-10">
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FFD700]/25 bg-gradient-to-br from-[#161616] via-[#101010] to-[#151515] p-5 sm:p-8 lg:p-12 shadow-2xl">
          
          {/* 
            Desktop: 45/55 Split Composition (lg:grid-cols-12, 5 cols text / 7 cols imagery)
            Mobile: Text is stacked ABOVE imagery for immediate readability before images load
          */}
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            
            {/* 1. TEXT CONTENT (Desktop: 45% / 5 Cols, Mobile: 1st in DOM) */}
            <div 
              ref={textRef} 
              className="lg:col-span-5 flex flex-col justify-center order-1 transition-opacity duration-300"
            >
              {/* Category / Badge Pill */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFD700]">
                  <Sparkles className="h-3.5 w-3.5 text-[#FFD700]" />
                  {activeSlide.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-gray-400">
                  0{current + 1} / 0{heroSlides.length}
                </span>
              </div>

              {/* Strong Display Headline */}
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.08]">
                {activeSlide.title}
              </h1>

              {/* Short Supporting Copy */}
              <p className="mt-3 text-sm leading-relaxed text-gray-300 sm:text-base">
                {activeSlide.subtitle}
              </p>

              {/* Deal Price Callout */}
              <div className="mt-5 inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <Tag className="h-4 w-4 text-[#FFD700]" />
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">Deal:</span>
                <span className="text-xl sm:text-2xl font-black text-[#FFD700]">
                  {activeSlide.dealPrice}
                </span>
              </div>

              {/* Actions: Primary CTA & Restrained Secondary CTA */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={activeSlide.targetHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-6 sm:px-7 py-3 sm:py-3.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-lg"
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

              {/* Restrained Slide Indicator Dots & Prev/Next */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrent(idx)}
                      aria-label={`Go to slide ${idx + 1}: ${slide.categoryName}`}
                      className={`h-2 transition-all rounded-full ${
                        current === idx 
                          ? 'w-8 bg-[#FFD700]' 
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

            {/* 2. FASHION-EDITORIAL IMAGERY (Desktop: 55% / 7 Cols, Mobile: 2nd in DOM) */}
            <div 
              ref={imageRef} 
              className="lg:col-span-7 flex items-center justify-center order-2 transition-opacity duration-300"
            >
              <Link
                href={activeSlide.targetHref}
                className="group relative block w-full overflow-hidden rounded-2xl bg-[#050505] border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
              >
                <div className="relative flex items-center justify-center p-2 sm:p-4 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    fetchPriority="high"
                    decoding="async"
                    className="max-h-[380px] sm:max-h-[460px] md:max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-2xl transition duration-500 group-hover:brightness-105"
                  />
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/35 rounded-xl backdrop-blur-[2px]">
                    <span className="flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-xl">
                      <ShoppingBag className="h-4 w-4" />
                      <span>View Deal Details</span>
                    </span>
                  </div>
                </div>

                {/* Subtle Image Footer Pill */}
                <div className="flex items-center justify-between border-t border-white/10 bg-[#121212] px-4 py-2.5 text-[11px] text-gray-400">
                  <span className="font-bold text-white/90">{activeSlide.categoryName}</span>
                  <span className="font-semibold text-[#FFD700]">Verified Authentic Stock</span>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
