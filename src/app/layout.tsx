import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Two Stars — A Love Story Written in Starlight",
  description:
    "An interactive cinematic story of two people who met online, told through animations, particles, and the language of stars.",
  keywords: ["love story", "interactive", "birthday", "stars"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${spaceMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-cosmic-dark text-foreground">
        {children}
      </body>
    </html>
  );
}
