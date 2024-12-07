export interface SquareProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  variations?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  expiresAt: string;
}
