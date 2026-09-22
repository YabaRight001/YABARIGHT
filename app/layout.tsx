import type { Metadata } from 'next';
import '@/styles/globals.css';
import { WhatsAppChat } from '@/components/WhatsAppChat';

export const metadata: Metadata = {
  metadataBase: new URL('https://yabaright.com'),
  title: 'YABARIGHT - The Digital Home of Affordable Fashion',
  description:
    'Buy and sell quality thrift clothes, bags, and shoes online. Look good, spend smart, shop right.',
  keywords:
    'thrift fashion, affordable fashion, online shopping, Nigeria, Lagos',
  openGraph: {
    title: 'YABARIGHT',
    description: 'The Digital Home of Affordable Fashion',
    url: 'https://yabaright.com',
    images: [
      {
        url: 'https://yabaright.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        <WhatsAppChat />
      </body>
    </html>
  );
}
