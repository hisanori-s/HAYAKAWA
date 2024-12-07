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
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "HAYAKAWA",
          description: "当店の看板商品。ジューシーな肉汁と香ばしい皮が特徴です。",
          availableOnline: true,
          variations: [
            {
              id: "gyoza-hayakawa-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "gyoza-hayakawa",
                name: "レギュラー",
                priceMoney: {
                  amount: 600,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        },
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80"
      },
      {
        id: "gyoza-shiso",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "しそ",
          description: "さっぱりとした味わい",
          availableOnline: true,
          variations: [
            {
              id: "gyoza-shiso-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "gyoza-shiso",
                name: "レギュラー",
                priceMoney: {
                  amount: 550,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "gyoza-ginger",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "生姜",
          description: "体が温まる一品",
          availableOnline: true,
          variations: [
            {
              id: "gyoza-ginger-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "gyoza-ginger",
                name: "レギュラー",
                priceMoney: {
                  amount: 550,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "gyoza-age",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "揚げ",
          description: "カリッと香ばしい",
          availableOnline: true,
          variations: [
            {
              id: "gyoza-age-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "gyoza-age",
                name: "レギュラー",
                priceMoney: {
                  amount: 600,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "gyoza-inoshishi",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "イノシシ",
          description: "ジビエ好きにおすすめ",
          availableOnline: true,
          variations: [
            {
              id: "gyoza-inoshishi-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "gyoza-inoshishi",
                name: "レギュラー",
                priceMoney: {
                  amount: 800,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "gyoza-kuma",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "クマ",
          description: "珍しい一品",
          availableOnline: true,
          variations: [
            {
              id: "gyoza-kuma-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "gyoza-kuma",
                name: "レギュラー",
                priceMoney: {
                  amount: 1000,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "gyoza-mutton",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "マトン",
          description: "羊肉の旨みたっぷり",
          availableOnline: true,
          variations: [
            {
              id: "gyoza-mutton-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "gyoza-mutton",
                name: "レギュラー",
                priceMoney: {
                  amount: 700,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: "デザート",
    items: [
      {
        id: "dessert-apple",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "フルーツ餃子（りんご）",
          description: "甘酸っぱい人気商品",
          availableOnline: true,
          variations: [
            {
              id: "dessert-apple-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "dessert-apple",
                name: "レギュラー",
                priceMoney: {
                  amount: 500,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "dessert-kaki",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "フルーツ餃子（柿）",
          description: "秋の味覚",
          availableOnline: true,
          variations: [
            {
              id: "dessert-kaki-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "dessert-kaki",
                name: "レギュラー",
                priceMoney: {
                  amount: 500,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "dessert-grape",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "フルーツ餃子（ぶどう）",
          description: "ジューシーな一品",
          availableOnline: true,
          variations: [
            {
              id: "dessert-grape-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "dessert-grape",
                name: "レギュラー",
                priceMoney: {
                  amount: 500,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: "セット",
    items: [
      {
        id: "set-party",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "餃子パーティ手作りセット",
          description: "みんなで楽しく餃子作り",
          availableOnline: true,
          variations: [
            {
              id: "set-party-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "set-party",
                name: "レギュラー",
                priceMoney: {
                  amount: 2000,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "set-all",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "全種盛り合わせセット",
          description: "全種類の餃子を少しずつ",
          availableOnline: true,
          variations: [
            {
              id: "set-all-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "set-all",
                name: "レギュラー",
                priceMoney: {
                  amount: 3000,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "set-dessert",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "デザート盛り合わせセット",
          description: "甘い物好きに",
          availableOnline: true,
          variations: [
            {
              id: "set-dessert-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "set-dessert",
                name: "レギュラー",
                priceMoney: {
                  amount: 1500,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: "グッズ",
    items: [
      {
        id: "goods-handkerchief",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "ハンカチ",
          description: "可愛い餃子柄",
          availableOnline: true,
          variations: [
            {
              id: "goods-handkerchief-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "goods-handkerchief",
                name: "レギュラー",
                priceMoney: {
                  amount: 500,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "goods-pouch",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "ポーチ",
          description: "使いやすいサイズ",
          availableOnline: true,
          variations: [
            {
              id: "goods-pouch-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "goods-pouch",
                name: "レギュラー",
                priceMoney: {
                  amount: 1000,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "goods-lard",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "ラード",
          description: "当店秘伝のラード",
          availableOnline: true,
          variations: [
            {
              id: "goods-lard-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "goods-lard",
                name: "レギュラー",
                priceMoney: {
                  amount: 800,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      },
      {
        id: "goods-yakumi",
        type: "ITEM",
        version: 1,
        isDeleted: false,
        presentAtAllLocations: true,
        itemData: {
          name: "薬味",
          description: "餃子に合う薬味セット",
          availableOnline: true,
          variations: [
            {
              id: "goods-yakumi-regular",
              type: "ITEM_VARIATION",
              version: 1,
              itemVariationData: {
                itemId: "goods-yakumi",
                name: "レギュラー",
                priceMoney: {
                  amount: 300,
                  currency: "JPY"
                },
                pricing_type: "FIXED_PRICING",
                available: true
              }
            }
          ]
        }
      }
    ]
  }
];
