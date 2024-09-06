
export type CartItem = {
    product_id: number;
    size_id: number;
    quantity: number;
    selected?: boolean;
    product_price: number;
    product_name: string;
    product_image: string;
    size_label: string;
  };