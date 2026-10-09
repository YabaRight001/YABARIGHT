import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f0e8] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header - Matching Homepage Style */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#FFD700]/30 bg-[#0b0b0b] shadow-lg">
        <div className="container-custom flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="YabaRight Logo" 
              className="h-16 w-auto sm:h-20"
            />
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/products" className="text-sm font-bold text-white/80 transition hover:text-[#FFD700]">
              Browse Products
            </Link>
            <Link
              href="/"
              className="rounded-full bg-[#FFD700] px-5 py-2 text-sm font-black text-black transition hover:bg-[#ffcc00]"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="pt-24 mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/95 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <div className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hidden items-center justify-center bg-[#0b0b0b] p-8 lg:flex">
              <div className="max-w-md text-white">
                <img 
                  src="/logo.png" 
                  alt="YabaRight Logo" 
                  className="mb-6 h-20 w-auto"
                />
                <h2 className="mt-6 text-4xl font-black leading-tight">
                  Shop smarter. <span className="text-[#FFD700]">Style brighter.</span>
                </h2>
                <p className="mt-4 text-base text-white/70">
                  Discover quality pre owned pieces that look premium, feel effortless, and fit your
                  budget perfectly.
                </p>

                <div className="mt-8 space-y-4">
                  {['Curated thrift essentials', 'Trustworthy fashion sellers', 'Fast and easy checkout'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD700] text-lg font-black text-black">
                        ✓
                      </div>
                      <span className="text-sm text-white/85">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 sm:p-8">
              <div className="w-full max-w-md">
                <div className="mb-8 text-center lg:text-left">
                  <img 
                    src="/logo.png" 
                    alt="YabaRight Logo" 
                    className="mx-auto h-20 w-auto lg:mx-0"
                  />
                  <p className="mt-2 text-sm text-gray-600">Look Good. Spend Smart. Shop Right.</p>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
