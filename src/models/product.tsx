export type Product = {
  product_id: number;
  product_name: string;
  product_description: string;
  product_price: number;
  product_image: string;
  stock: number;
  categories: {
    category_id: number;
    category_name: string;
  }[];
  sizes: {
    size_id: number;
    size_label: string;
  }[];
};
