import { SquareProduct } from '@/lib/square/types';

export type ProductGroup = {
  name: string;
  items: SquareProduct[];
};

export const DEMO_PRODUCTS: ProductGroup[] = [
  {
    name: "餃子",
    items: [
      {
        id: "gyoza-hayakawa",
        name: "HAYAKAWA",
        description: "当店の看板商品。ジューシーな肉汁と香ばしい皮が特徴です。",
        price: 600,
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80",
      },
      { id: "gyoza-shiso", name: "しそ", description: "さっぱりとした味わい", price: 550 },
      { id: "gyoza-ginger", name: "生姜", description: "体が温まる一品", price: 550 },
      { id: "gyoza-age", name: "揚げ", description: "カリッと香ばしい", price: 600 },
      { id: "gyoza-inoshishi", name: "イノシシ", description: "ジビエ好きにおすすめ", price: 800 },
      { id: "gyoza-kuma", name: "クマ", description: "珍しい一品", price: 1000 },
      { id: "gyoza-mutton", name: "マトン", description: "羊肉の旨みたっぷり", price: 700 },
    ]
  },
  {
    name: "デザート",
    items: [
      { id: "dessert-apple", name: "フルーツ餃子（りんご）", description: "甘酸っぱい人気商品", price: 500 },
      { id: "dessert-kaki", name: "フルーツ餃子（柿）", description: "秋の味覚", price: 500 },
      { id: "dessert-grape", name: "フルーツ餃子（ぶどう）", description: "ジューシーな一品", price: 500 },
    ]
  },
  {
    name: "セット",
    items: [
      { id: "set-party", name: "餃子パーティ手作りセット", description: "みんなで楽しく餃子作り", price: 2000 },
      { id: "set-all", name: "全種盛り合わせセット", description: "全種類の餃子を少しずつ", price: 3000 },
      { id: "set-dessert", name: "デザート盛り合わせセット", description: "甘い物好きに", price: 1500 },
    ]
  },
  {
    name: "グッズ",
    items: [
      { id: "goods-handkerchief", name: "ハンカチ", description: "可愛い餃子柄", price: 500 },
      { id: "goods-pouch", name: "ポーチ", description: "使いやすいサイズ", price: 1000 },
      { id: "goods-lard", name: "ラード", description: "当店秘伝のラード", price: 800 },
      { id: "goods-yakumi", name: "薬味", description: "餃子に��う�味セット", price: 300 },
    ]
  },
];
