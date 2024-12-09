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
        type: "ITEM",
        id: "gyoza-hayakawa",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "HAYAKAWA",
          description: "当店の看板商品。ジューシーな肉汁と香ばしい皮が特徴です。",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "gyoza-hayakawa-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "gyoza-hayakawa",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 60000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "gyoza-shiso",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "しそ",
          description: "さっぱりとした味わい",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "gyoza-shiso-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "gyoza-shiso",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 55000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "gyoza-ginger",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "生姜",
          description: "体が温まる一品",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "gyoza-ginger-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "gyoza-ginger",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 55000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "gyoza-age",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "揚げ",
          description: "カリッと香ばしい",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "gyoza-age-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "gyoza-age",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 60000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "gyoza-inoshishi",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "イノシシ",
          description: "ジビエ好きにおすすめ",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "gyoza-inoshishi-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "gyoza-inoshishi",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 80000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "gyoza-kuma",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "クマ",
          description: "珍しい一品",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "gyoza-kuma-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "gyoza-kuma",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 100000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "gyoza-mutton",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "マトン",
          description: "羊肉の旨みたっぷり",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "gyoza-mutton-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "gyoza-mutton",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 70000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      }
    ]
  },
  {
    name: "デザート",
    items: [
      {
        type: "ITEM",
        id: "dessert-apple",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "フルーツ餃子（りんご）",
          description: "甘酸っぱい人気商品",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "dessert-apple-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "dessert-apple",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 50000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "dessert-kaki",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "フルーツ餃子（柿）",
          description: "秋の味覚",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "dessert-kaki-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "dessert-kaki",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 50000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "dessert-grape",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "���ルーツ餃子（ぶどう）",
          description: "ジューシーな一品",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "dessert-grape-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "dessert-grape",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 50000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      }
    ]
  },
  {
    name: "セット",
    items: [
      {
        type: "ITEM",
        id: "set-party",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "餃子パーティ手作りセット",
          description: "みんなで楽しく餃子作り",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "set-party-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "set-party",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 200000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "set-all",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "全種盛り合わせセット",
          description: "全種類の餃子を少しずつ",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "set-all-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "set-all",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 300000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "set-dessert",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "デザート盛り合わせセット",
          description: "甘い物好きに",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "set-dessert-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "set-dessert",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 150000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      }
    ]
  },
  {
    name: "グッズ",
    items: [
      {
        type: "ITEM",
        id: "goods-handkerchief",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "ハンカチ",
          description: "可愛い餃子柄",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "goods-handkerchief-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "goods-handkerchief",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 50000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "goods-pouch",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "ポーチ",
          description: "使いやすいサイズ",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "goods-pouch-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "goods-pouch",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 100000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "goods-lard",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "ラード",
          description: "当店秘伝のラード",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "goods-lard-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "goods-lard",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 80000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      },
      {
        type: "ITEM",
        id: "goods-yakumi",
        version: 1,
        updated_at: "2024-02-09T00:00:00.000Z",
        created_at: "2024-02-09T00:00:00.000Z",
        is_deleted: false,
        present_at_all_locations: true,
        item_data: {
          name: "薬味",
          description: "餃子に合う薬味セット",
          is_taxable: true,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "goods-yakumi-regular",
              version: 1,
              updated_at: "2024-02-09T00:00:00.000Z",
              created_at: "2024-02-09T00:00:00.000Z",
              is_deleted: false,
              present_at_all_locations: true,
              item_variation_data: {
                item_id: "goods-yakumi",
                name: "レギュラー",
                ordinal: 0,
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: 30000,
                  currency: "JPY"
                },
                track_inventory: false,
                sellable: true,
                stockable: true
              }
            }
          ],
          product_type: "REGULAR"
        }
      }
    ]
  }
];
