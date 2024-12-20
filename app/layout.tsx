import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";

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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
