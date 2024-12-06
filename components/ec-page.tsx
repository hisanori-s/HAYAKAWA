'use client'

import Image from "next/image"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { DeliveryInfo } from "@/components/delivery-info"
import { DeliveryDate } from "@/components/delivery-date"
import { ShoppingCart } from 'lucide-react'

export default function ECPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1290&q=80"
          alt="Plate of delicious gyoza"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-4">HAYAKAWA-GYOZA</h1>
          <p className="text-sm md:text-base tracking-wider mb-6">最高の餃子をあなたに</p>
        </div>
      </div>

      {/* Menu Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full flex justify-between border-b rounded-none h-auto p-0 bg-transparent">
            <div className="flex">
              <TabsTrigger
                value="products"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                商品一覧
              </TabsTrigger>
              <TabsTrigger
                value="delivery"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                配送料について
              </TabsTrigger>
              <TabsTrigger
                value="date"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                お届け日について
              </TabsTrigger>
            </div>
            <TabsTrigger
              value="cart"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              <ShoppingCart className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductList />
          </TabsContent>
          <TabsContent value="delivery">
            <DeliveryInfo />
          </TabsContent>
          <TabsContent value="date">
            <DeliveryDate />
          </TabsContent>
          <TabsContent value="cart">
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">カート</h2>
              <p>カートの内容がここに表示されます。</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground"
          >
            <path
              d="M196 100C196 152.467 152.467 196 100 196C47.5329 196 4 152.467 4 100C4 47.5329 47.5329 4 100 4C152.467 4 196 47.5329 196 100Z"
              stroke="currentColor"
              strokeWidth="8"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

