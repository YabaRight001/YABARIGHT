import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { ToastContainer } from '@/components/Toast';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#111111]">
      <Navbar />
      <div className="flex-1 pb-16 lg:pb-0">
        {children}
      </div>
      <Footer />
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
