/**
 * 注文関連の定数
 */

// 1回の注文で指定可能な最大数量（在庫管理対象外の商品）
export const DEFAULT_MAX_ORDER_QUANTITY = 10;

// 注文に関する設定
export const ORDER_SETTINGS = {
  // 在庫管理対象外の商品の最大注文数
  defaultMaxQuantity: DEFAULT_MAX_ORDER_QUANTITY,

  // 在庫管理対象商品の注文数制限
  inventory: {
    // 在庫数が指定数以下の場合に警告を表示
    warningThreshold: 5,
  },
} as const;
