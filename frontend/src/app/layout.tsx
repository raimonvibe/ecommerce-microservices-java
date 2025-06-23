import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SparkleBackground from '@/components/SparkleBackground';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RainbowForest E-commerce',
  description: 'Professional dark mode e-commerce platform with microservices architecture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-950 text-white min-h-screen`}>
        <SparkleBackground />
        <div className="relative z-10">
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
