import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { DEMO_PRODUCTS } from '@/lib/constants/demo-products'
import { SquareProduct } from '@/lib/square/types'
import { useCartStore } from '@/lib/store/cart'

export function ProductList() {
  const addToCart = useCartStore(state => state.addItem);
  const productGroups = DEMO_PRODUCTS;

  return (
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
      {productGroups.map((group) => (
        <section key={group.name}>
          <h2 className="text-lg tracking-wide text-muted-foreground mb-4">{group.name}</h2>
          <div className="space-y-4">
            {group.items.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                    </div>
                    <div className="border-b border-dotted border-muted-foreground flex-grow mx-4" />
                    <p className="font-medium">{item.price}円</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                  </DialogHeader>
                  <ProductModal product={item} onAddToCart={addToCart} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

interface ProductModalProps {
  product: SquareProduct;
  onAddToCart: (item: { id: string; name: string; price: number; quantity: number }) => void;
}

function ProductModal({ product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  };

  return (
    <div className="space-y-4">
      {product.imageUrl && (
        <div className="relative h-64 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
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
        <Button onClick={handleAddToCart}>
          カートに追加
        </Button>
      </div>
    </div>
  );
}

