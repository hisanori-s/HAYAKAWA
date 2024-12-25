'use client';

import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { DefaultMaxOrderQuantity } from '@/lib/constants/order';

export function CartItems() {
  const { items, updateQuantity, removeItem, inventoryItems } = useCartStore();

  // 在庫数を取得する関数
  const getMaxQuantity = (itemId: string) => {
    if (!items.find(item => item.id === itemId)?.requiresInventory) {
      return DefaultMaxOrderQuantity;
    }
    const inventoryItem = inventoryItems.find(inv => inv.id === itemId);
    const inventoryCount = inventoryItem?.variations[0]?.inventoryCount ?? 0;
    return Math.min(inventoryCount, DefaultMaxOrderQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">カートに商品がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const maxQuantity = getMaxQuantity(item.id);
        return (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price}円</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newQuantity = Math.max(1, item.quantity - 1);
                  if (newQuantity <= maxQuantity) {
                    updateQuantity(item.id, newQuantity);
                  }
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0 && value <= maxQuantity) {
                    updateQuantity(item.id, value);
                  }
                }}
                className="w-20 text-center"
                min="1"
                max={maxQuantity}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newQuantity = item.quantity + 1;
                  if (newQuantity <= maxQuantity) {
                    updateQuantity(item.id, newQuantity);
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
