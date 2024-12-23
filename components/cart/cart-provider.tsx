'use client'

import { ReactNode, createContext, useContext } from 'react';
import { useCartStore, CartItem } from '@/lib/store/cart';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  handleAddToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addItem);

  // カートに商品を追加する際のハンドラー
  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
    toast({
      title: 'カートに追加しました',
      description: `${item.name} × ${item.quantity}`,
    });
  };

  return (
    <CartContext.Provider value={{ handleAddToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
