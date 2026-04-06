import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Inter, Playfair_Display, Rubik_Mono_One as Rubik } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-playfair',
});

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: "Leonardo's Portfolio",
  description: "Portafolio de Leonardo",
};

import SmoothScroller from "@/components/SmoothScroller";
import CursorFollower from '@/components/CursorFollower';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable} ${playfair.variable} ${rubik.variable} antialiased`}
      >
        <CursorFollower />
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body>
    </html>
  );
}
