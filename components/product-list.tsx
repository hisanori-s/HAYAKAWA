import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import Image from "next/image"

type Product = {
  name: string
  description: string
  price: string
  images: string[]
}

type ProductGroup = {
  name: string
  items: Product[]
}

const productGroups: ProductGroup[] = [
  {
    name: "餃子",
    items: [
      { 
        name: "HAYAKAWA", 
        description: "当店の看板商品。ジューシーな肉汁と香ばしい皮が特徴です。", 
        price: "600",
        images: [
          "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80",
          "https://images.unsplash.com/photo-1541696490-8744a5dc0228?w=500&q=80",
          "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&q=80"
        ]
      },
      { name: "しそ", description: "さっぱりとした味わい", price: "550", images: [] },
      { name: "生姜", description: "体が温まる一品", price: "550", images: [] },
      { name: "揚げ", description: "カリッと香ばしい", price: "600", images: [] },
      { name: "イノシシ", description: "ジビエ好きにおすすめ", price: "800", images: [] },
      { name: "クマ", description: "珍しい一品", price: "1000", images: [] },
      { name: "マトン", description: "羊肉の旨みたっぷり", price: "700", images: [] },
    ]
  },
  {
    name: "デザート",
    items: [
      { name: "フルーツ餃子（りんご）", description: "甘酸っぱい人気商品", price: "500", images: [] },
      { name: "フルーツ餃子（柿）", description: "秋の味覚", price: "500", images: [] },
      { name: "フルーツ餃子（ぶどう）", description: "ジューシーな一品", price: "500", images: [] },
    ]
  },
  {
    name: "セット",
    items: [
      { name: "餃子パーティ手作りセット", description: "みんなで楽しく餃子作り", price: "2000", images: [] },
      { name: "全種盛り合わせセット", description: "全種類の餃子を少しずつ", price: "3000", images: [] },
      { name: "デザート盛り合わせセット", description: "甘い物好きに", price: "1500", images: [] },
    ]
  },
  {
    name: "グッズ",
    items: [
      { name: "ハンカチ", description: "可愛い餃子柄", price: "500", images: [] },
      { name: "ポーチ", description: "使いやすいサイズ", price: "1000", images: [] },
      { name: "ラード", description: "当店秘伝のラード", price: "800", images: [] },
      { name: "薬味", description: "餃子に合う薬味セット", price: "300", images: [] },
    ]
  },
]

export function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)

  const handleNextProduct = () => {
    const currentGroup = productGroups[selectedGroupIndex]
    if (selectedItemIndex < currentGroup.items.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1)
      setSelectedProduct(currentGroup.items[selectedItemIndex + 1])
    } else if (selectedGroupIndex < productGroups.length - 1) {
      setSelectedGroupIndex(selectedGroupIndex + 1)
      setSelectedItemIndex(0)
      setSelectedProduct(productGroups[selectedGroupIndex + 1].items[0])
    }
  }

  const handlePrevProduct = () => {
    if (selectedItemIndex > 0) {
      setSelectedItemIndex(selectedItemIndex - 1)
      setSelectedProduct(productGroups[selectedGroupIndex].items[selectedItemIndex - 1])
    } else if (selectedGroupIndex > 0) {
      setSelectedGroupIndex(selectedGroupIndex - 1)
      const prevGroup = productGroups[selectedGroupIndex - 1]
      setSelectedItemIndex(prevGroup.items.length - 1)
      setSelectedProduct(prevGroup.items[prevGroup.items.length - 1])
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
      {productGroups.map((group) => (
        <section key={group.name}>
          <h2 className="text-lg tracking-wide text-muted-foreground mb-4">{group.name}</h2>
          <div className="space-y-4">
            {group.items.map((item) => (
              <Dialog key={item.name}>
                <DialogTrigger asChild>
                  <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                    </div>
                    <div className="border-b border-dotted border-muted-foreground flex-grow mx-4" />
                    <p className="font-medium">{item.price}</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                  </DialogHeader>
                  <ProductModal product={item} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}


function ProductModal({ product }: { product: Product }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const nextImage = () => setImageIndex((imageIndex + 1) % product.images.length)
  const prevImage = () => setImageIndex((imageIndex - 1 + product.images.length) % product.images.length)

  return (
    <div className="space-y-4">
      <div className="relative h-64 w-full">
        <Image
          src={product.images[imageIndex]}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
        {product.images.length > 1 && (
          <>
            <Button onClick={prevImage} variant="outline" size="icon" className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={nextImage} variant="outline" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <p className="text-lg font-semibold">{product.price}円</p>
      <p className="text-sm text-gray-500">{product.description}</p>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          max={10}
          className="w-20"
        />
        <Button onClick={() => console.log(`Added ${quantity} ${product.name} to cart`)}>
          カートに追加
        </Button>
      </div>
    </div>
  )
}

