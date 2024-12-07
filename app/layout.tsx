import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "HAYAKAWA EC",
  description: "餃子専門店HAYAKAWAのオンラインショップ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
