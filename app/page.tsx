import Link from 'next/link';
import { sampleProducts } from '@/lib/mockProducts';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { ToastContainer } from '@/components/Toast';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { 
  Flame, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  BadgePercent, 
  Award, 
  Sparkles,
  Users,
  Store,
  MapPin
} from 'lucide-react';

const categoryPills = [
  { name: 'All Marketplace', href: '/products' },
  { name: 'Suits Below ₦30k', href: '/products?category=suits&max_price=30000' },
  { name: 'Corporate Shoes ₦22.9k', href: '/products?category=shoes&max_price=23000' },
  { name: 'Office Shirts ₦9.9k', href: '/products?category=shirts&max_price=10000' },
  { name: 'Casuals ₦9.9k', href: '/products?category=shirts&max_price=10000' },
  { name: 'Bags & Totes', href: '/products?category=bags' },
  { name: 'Denim Jeans', href: '/products?category=clothing' },
  { name: "Women's Heels", href: '/products?category=shoes' },
];

const quickCategories = [
  {
    title: 'Corporate Shoes',
    subtitle: 'Oxfords • Loafers • Derby Pairs',
    image: '/male-shoes-collection.jpg',
    count: '2,340+ pairs',
    href: '/products?category=shoes',
  },
  {
    title: 'Leather Bags',
    subtitle: 'Totes • Handbags • Crossbody',
    image: '/bag-handbag.jpg',
    count: '1,850+ items',
    href: '/products?category=bags',
  },
  {
    title: 'Denim & Jeans',
    subtitle: 'Straight Cuts • Washed Streetwear',
    image: '/jeans-folded.jpg',
    count: '4,200+ pieces',
    href: '/products?category=clothing',
  },
  {
    title: 'Shirts & Polos',
    subtitle: 'Casual Shirts • Office Stripes',
    image: '/casual-shirts-colorful.jpg',
    count: '1,560+ shirts',
    href: '/products?category=shirts',
  },
  {
    title: 'Suits & Blazers',
    subtitle: 'Two-Piece Suits • Smart Office Fits',
    image: '/suit-blue-1.jpg',
    count: '890+ suits',
    href: '/products?category=suits',
  },
  {
    title: "Women's Heels & Flats",
    subtitle: 'Stiletto Pumps • Suede Ballet Flats',
    image: '/heels-black-pair.jpg',
    count: '1,120+ pairs',
    href: '/products?category=shoes',
  },
];

const styleCollections = [
  {
    title: 'Folded Shirts & Casuals',
    caption: 'Clean rolls • ₦9,999 deal packs',
    image: '/folded-shirts-blue.jpg',
    accent: 'from-[#f5d76f] to-[#f4c542]',
    link: '/products?category=shirts&max_price=10000',
  },
  {
    title: 'Executive Tailored Suits',
    caption: 'Smart business sets under ₦30,000',
    image: '/suit-grey-1.jpg',
    accent: 'from-[#a7d5d9] to-[#54c1c5]',
    link: '/products?category=suits&max_price=30000',
  },
  {
    title: 'Vintage Denim Washes',
    caption: 'Heavyweight denim • Daily streetwear fits',
    image: '/jeans-stack.jpg',
    accent: 'from-[#f4d8c6] to-[#d7a58c]',
    link: '/products?category=clothing',
  },
];

const genderCollections = [
  {
    label: "Men's Collection",
    description: 'Executive suits, corporate leather shoes, folded shirts, and casual streetwear',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=male',
  },
  {
    label: "Women's Collection",
    description: 'Ankara wraps, silk lace boubou gowns, designer handbags, and stiletto heels',
    image: 'https://images.unsplash.com/photo-1614081781451-29c084a7de30?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=female',
  },
];

export default function Home() {
  // Campaign deals under ₦25,000 matching posters
  const campaignDeals = [
    sampleProducts.find((p) => p.id === 'prod-4')!, // Folded Office Shirts (₦9,999)
    sampleProducts.find((p) => p.id === 'prod-6')!, // Chop Casuals (₦9,999)
    sampleProducts.find((p) => p.id === 'prod-3')!, // Chop Corporate Shoes (₦22,999)
    sampleProducts.find((p) => p.id === 'prod-5')!, // Executive Suit (₦28,500)
  ].filter(Boolean);

  // Top featured products for home showcase
  const featuredProducts = sampleProducts.slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#111111]">
      <Navbar />

      <main className="flex-1 pb-16 lg:pb-0">
        {/* Interactive Responsive Hero Section with User Uploaded Posters */}
        <HeroCarousel />

        {/* Quick Category Bar */}
        <section className="border-y border-[#FFD700]/20 bg-[#0e0e0e] py-3.5">
          <div className="container-custom">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              {categoryPills.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="whitespace-nowrap rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FFD700] transition-all hover:bg-[#FFD700] hover:text-black"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Campaign Deals Section */}
        <section id="special-offers" className="border-b border-black/5 bg-gradient-to-b from-amber-50/70 via-[#fffaf0] to-[#fffaf0] py-14">
          <div className="container-custom">
            <div className="mb-8 flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                <Flame className="h-4 w-4" />
                Poster Campaign Deals
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
                Featured Deals You Saw on the Banner
              </h2>
              <p className="mt-2.5 max-w-xl text-sm sm:text-base text-gray-600">
                Directly shop the suits below ₦30k, corporate shoes at ₦22,999, and folded shirt packs at ₦9,999.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {campaignDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-7 py-3 text-xs font-black uppercase tracking-wider text-[#FFD700] transition-all hover:bg-black hover:scale-105 shadow-md"
              >
                <span>View Full YabaRight Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Browse by Category Grid */}
        <section id="categories" className="container-custom py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                Accurate Category Directory
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111]">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#c88d00] transition"
            >
              <span>Explore all</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {quickCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FFD700]/50 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-base font-black text-white drop-shadow-sm">
                      {category.title}
                    </p>
                    <p className="text-[11px] font-bold text-[#FFD700]">
                      {category.count}
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-xs text-gray-500">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Showcase */}
        <section className="border-t border-black/5 bg-white py-14">
          <div className="container-custom">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                  Verified Inventory
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111]">
                  Latest Handpicked Fits
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Curated Style Collections */}
        <section className="container-custom py-14">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
              Curated Style Drops
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111]">
              Fresh Local Edits
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {styleCollections.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#f9f5f0] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`relative h-80 bg-gradient-to-br ${item.accent} overflow-hidden`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover mix-blend-multiply opacity-90 transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-2xl font-black text-white drop-shadow-md">{item.title}</p>
                    <p className="mt-1 text-xs sm:text-sm text-white/90">{item.caption}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md transition group-hover:bg-[#FFD700] group-hover:text-black">
                      <span>Shop Edit</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Gender Split Banner (African / Black Models) */}
        <section className="border-t border-black/5 bg-[#fbf8f2] py-14">
          <div className="container-custom">
            <div className="mb-8 text-center">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                Shop by Style
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111]">
                Men&apos;s & Women&apos;s Edits
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {genderCollections.map((spot) => (
                <Link
                  key={spot.label}
                  href={spot.link}
                  className="group relative overflow-hidden rounded-[2rem] border border-black/10 shadow-sm transition hover:shadow-2xl"
                >
                  <div className="h-96 w-full overflow-hidden bg-black">
                    <img
                      src={spot.image}
                      alt={spot.label}
                      className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <p className="text-3xl font-black text-white">{spot.label}</p>
                    <p className="mt-2 text-sm text-white/80 max-w-md">{spot.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black transition group-hover:bg-white group-hover:scale-105">
                      <span>Shop Collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why YabaRight Value Props */}
        <section className="bg-white py-14">
          <div className="container-custom">
            <div className="mb-10 text-center">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                Why Shop YabaRight?
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111]">
                Built for Nigerian Everyday Shoppers
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center rounded-[1.5rem] border border-black/5 bg-[#fbf8f2] p-6 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD700]/20 text-[#c88d00]">
                  <Truck className="h-7 w-7" />
                </div>
                <h3 className="text-base font-black text-[#111111]">Fast Nationwide Delivery</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Reliable dispatch across Lagos, Abuja, Port Harcourt, and all 36 states in 2-5 days.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-[1.5rem] border border-black/5 bg-[#fbf8f2] p-6 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD700]/20 text-[#c88d00]">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-base font-black text-[#111111]">Vetted Nigerian Vendors</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Every merchant is verified and products are checked for authentic quality and grading.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-[1.5rem] border border-black/5 bg-[#fbf8f2] p-6 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD700]/20 text-[#c88d00]">
                  <BadgePercent className="h-7 w-7" />
                </div>
                <h3 className="text-base font-black text-[#111111]">Real Thrift Prices</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Honest, transparent deals matching the posters so you get maximum style per Naira spent.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-[1.5rem] border border-black/5 bg-[#fbf8f2] p-6 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD700]/20 text-[#c88d00]">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="text-base font-black text-[#111111]">5-Star Condition Grading</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Accurate, honest condition ratings so you know the exact state of every thrift fashion piece.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Marketplace Statistics */}
        <section className="container-custom py-14">
          <div className="overflow-hidden rounded-[2.25rem] bg-[#0f0f0f] p-8 text-white shadow-xl md:p-12 border border-[#FFD700]/20">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700] mb-3">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black text-[#FFD700] md:text-4xl">5,000+</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Curated Products</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700] mb-3">
                  <Store className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black text-[#FFD700] md:text-4xl">2,500+</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Verified Sellers</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700] mb-3">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black text-[#FFD700] md:text-4xl">10,000+</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Happy Buyers</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700] mb-3">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black text-[#FFD700] md:text-4xl">36</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">States Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us (WHO WE ARE!) Section */}
        <section id="about-us" className="border-t border-black/5 bg-gradient-to-b from-[#fffaf0] via-[#fbf5e6] to-[#fffaf0] py-16 sm:py-20">
          <div className="container-custom max-w-4xl">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#FFD700]/40 bg-[#0e0e0e] p-8 sm:p-12 md:p-16 text-white shadow-2xl">
              {/* Background Glow Accents */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FFD700]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#e8941f]/10 blur-3xl" />

              <div className="relative z-10 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#FFD700] mb-6">
                  <span>About Us</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                  YABARIGHT <br className="hidden sm:inline" />
                  <span className="text-[#FFD700]">WHO WE ARE!</span>
                </h2>

                <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-gray-300 font-medium">
                  <p className="text-base sm:text-lg text-white font-semibold italic">
                    There comes a time when a father has to choose…
                  </p>

                  <div className="rounded-2xl border-l-4 border-[#FFD700] bg-white/5 p-4 sm:p-5 text-gray-200">
                    <p className="text-lg sm:text-xl font-bold text-[#FFD700]">
                      “Do I look good and take care of myself, or do I pay my children’s school fees?”
                    </p>
                  </div>

                  <p>
                    A time when a man begins sacrificing his youth, his confidence, his appearance, and the little things that once made him feel alive — all because he has a family to provide for.
                  </p>

                  <div className="pt-2">
                    <p className="text-xs font-black uppercase tracking-widest text-[#FFD700]">
                      But here’s the truth:
                    </p>
                    <p className="mt-1 text-base sm:text-lg font-bold text-white">
                      A man shouldn’t have to lose himself just to take care of the people he loves.
                    </p>
                  </div>

                  <p>
                    The moment you stop caring about yourself, stop looking good, stop having that confidence and swag… something inside you begins to fade.
                  </p>

                  <p className="text-white font-bold">
                    And we don’t believe that should be your story.
                  </p>

                  <p className="text-lg font-bold text-[#FFD700]">
                    That’s the emotion behind Yabaright. ❤️
                  </p>

                  <p>
                    <strong className="text-white">Yabaright.ng</strong> is built around the idea that you can look good, live better, and still create an extra source of income.
                  </p>

                  <p>
                    Through our affiliate program, you have an opportunity to earn from products people already need and buy every day — while still living a life you’re proud of.
                  </p>

                  <div className="pt-4 border-t border-white/10 text-center sm:text-left">
                    <p className="text-lg sm:text-xl font-black text-white">
                      Look good. Earn more. Live better.
                    </p>
                    <p className="text-sm font-bold text-[#FFD700] mt-1">
                      This is what we stand for. ❤️
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-7 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 shadow-lg"
                  >
                    <span>Shop Fashion Fits</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/affiliate"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white/20 hover:text-[#FFD700]"
                  >
                    <span>Join Affiliate & Earn</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seller CTA Banner */}
        <section className="container-custom pb-14">
          <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-r from-[#FFD700] via-[#ffcc00] to-[#e8941f] p-8 md:p-12 shadow-lg">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
              <div>
                <h2 className="text-2xl font-black text-black md:text-3xl">
                  Turn Your Closet into Cash
                </h2>
                <p className="mt-2 text-sm text-black/80 max-w-lg">
                  Join thousands of fashion vendors and everyday thrifters selling pre-owned fits, vintage grails, and new inventory on YabaRight today.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] transition-all hover:bg-white hover:text-black hover:scale-105 shadow-xl"
              >
                <span>Start Selling Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
