export interface SquareProduct {
  type: string;
  id: string;
  version: number;
  updated_at: string;
  created_at: string;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  item_data: {
    name: string;
    description?: string;
    is_taxable: boolean;
    variations?: Array<{
      type: string;
      id: string;
      version: number;
      updated_at: string;
      created_at: string;
      is_deleted: boolean;
      present_at_all_locations: boolean;
      item_variation_data: {
        item_id: string;
        name: string;
        ordinal?: number;
        pricing_type: string;
        price_money: {
          amount: number;
          currency: string;
        };
        track_inventory?: boolean;
        sellable?: boolean;
        stockable?: boolean;
        location_overrides?: Array<{
          location_id: string;
          sold_out?: boolean;
        }>;
      };
    }>;
    product_type: string;
    categories?: Array<{
      id: string;
      ordinal?: number;
    }>;
    description_html?: string;
    description_plaintext?: string;
    is_archived?: boolean;
  };
}

export interface CategoryNode {
  id: string;
  name: string;
  items: SquareProduct[];
}

export interface CategoryResponse {
  categories: CategoryNode[];
}

export interface SquareError {
  error: string;
  details?: {
    message: string;
    type?: string;
    code?: string;
  };
}
