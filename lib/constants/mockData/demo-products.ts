/**
 * @note このファイルは削除対象です
 * Square APIからの商品表示に完全移行するため、このモックデータファイルは不要になります。
 */

import { CatalogObject } from 'square';
import { ProductGroup } from '../../square/types';

const createCatalogItem = (
  id: string,
  name: string,
  description: string,
  price: number,
  categoryId: string
): CatalogObject => ({
  type: "ITEM",
  id,
  version: BigInt(1),
  updatedAt: "2024-02-09T00:00:00.000Z",
  isDeleted: false,
  presentAtAllLocations: true,
  customAttributeValues: {},
  catalogV1Ids: [],
  itemData: {
    name,
    description,
    abbreviation: name,
    labelColor: "FFFFFF",
    availableOnline: true,
    availableForPickup: true,
    availableElectronically: true,
    categoryId,
    taxIds: [],
    modifierListInfo: [],
    variations: [
      {
        type: "ITEM_VARIATION",
        id: `${id}-regular`,
        version: BigInt(1),
        updatedAt: "2024-02-09T00:00:00.000Z",
        isDeleted: false,
        presentAtAllLocations: true,
        customAttributeValues: {},
        catalogV1Ids: [],
        itemVariationData: {
          itemId: id,
          name: "レギュラー",
          sku: `${id}-001`,
          ordinal: 0,
          pricingType: "FIXED_PRICING",
          priceMoney: {
            amount: BigInt(price),
            currency: "JPY"
          },
          trackInventory: false,
          sellable: true,
          stockable: true,
          serviceDuration: null,
          availableForBooking: false
        }
      }
    ],
    productType: "REGULAR"
  }
}) as CatalogObject;

export const DEMO_PRODUCTS: ProductGroup[] = [
  {
    name: "餃子",
    items: [
      createCatalogItem("gyoza-hayakawa", "HAYAKAWA", "当店の看板商品。ジューシーな肉汁と香ばしい皮が特徴です。", 600, "gyoza"),
      createCatalogItem("gyoza-shiso", "しそ", "さっぱりとした味わい", 550, "gyoza"),
      createCatalogItem("gyoza-ginger", "生姜", "体が温まる一品", 550, "gyoza"),
      createCatalogItem("gyoza-age", "揚げ", "カリッと香ばしい", 600, "gyoza"),
      createCatalogItem("gyoza-inoshishi", "イノシシ", "ジビエ好きにおすすめ", 800, "gyoza"),
      createCatalogItem("gyoza-kuma", "クマ", "珍しい一品", 1000, "gyoza"),
      createCatalogItem("gyoza-mutton", "マトン", "羊肉の旨みたっぷり", 700, "gyoza")
    ]
  },
  {
    name: "デザート",
    items: [
      createCatalogItem("dessert-apple", "フルーツ餃子（りんご）", "甘酸っぱい人気商品", 500, "dessert"),
      createCatalogItem("dessert-kaki", "フルーツ餃子（柿）", "秋の味覚", 500, "dessert"),
      createCatalogItem("dessert-grape", "フルーツ餃子（ぶどう）", "ジューシーな一品", 500, "dessert")
    ]
  },
  {
    name: "セット",
    items: [
      createCatalogItem("set-party", "餃子パーティ手作りセット", "みんなで楽しく餃子作り", 2000, "set"),
      createCatalogItem("set-all", "全種盛り合わせセット", "全種類の餃子を少しずつ", 3000, "set"),
      createCatalogItem("set-dessert", "デザート盛り合わせセット", "甘い物好きに", 1500, "set")
    ]
  },
  {
    name: "グッズ",
    items: [
      createCatalogItem("goods-handkerchief", "ハンカチ", "可愛い餃子柄", 500, "goods"),
      createCatalogItem("goods-pouch", "ポーチ", "使いやすいサイズ", 1000, "goods"),
      createCatalogItem("goods-lard", "ラード", "当店秘伝のラード", 800, "goods"),
      createCatalogItem("goods-yakumi", "薬味", "餃子に合う薬味セット", 300, "goods")
    ]
  }
];
