import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Rubik_Mono_One as Rubik } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leonardo's Portfolio",
  description: "Portafolio de Leonardo",
};

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

import SmoothScroller from "@/components/SmoothScroller";
import CursorFollower from '@/components/CursorFollower';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${rubik.variable} antialiased`}
      >
        <CursorFollower />
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body>
    </html>
  );
}
