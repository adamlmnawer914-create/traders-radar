import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { arSA } from '@clerk/localizations';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'رادار التجار | منصة ذكاء التجارة الإلكترونية الشاملة',
  description: 'المنصة الذكية لإدارة وتحليل المتاجر الإلكترونية وحساب صافي الأرباح بدقة واكتشاف المنتجات الرابحة.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} min-h-screen antialiased`}>
        <ClerkProvider localization={arSA}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
