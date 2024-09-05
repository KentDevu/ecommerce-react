import axios from 'axios';
import { Product } from '../models/product';

const apiUrl = 'http://localhost/ecommerce-api/public/api';

const ProductService = {
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
      const products = response.data?.data?.product;

      if (Array.isArray(products)) {
        // Fetch categories and sizes for each product
        const productsWithDetails = await Promise.all(products.map(async (product: Product) => {
          const categories = await ProductService.getProductCategory(product.product_id);
            const sizes = await ProductService.getProductSizes(product.product_id);
            return { ...product, categories, sizes };
        }));

        return productsWithDetails;
      } else {
        console.error("API response does not contain an array of products:", response.data);
        throw new Error('Invalid products data format');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (productId: number) => {
    try {
      const response = await axios.get(`${apiUrl}/products/${productId}`);
      return response.data.data.product;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  getAllProductSizes: async () => {
    try {
      const response = await axios.get(`${apiUrl}/sizes`);
      return response.data.data.sizes;
    } catch (error) {
      console.error("Error fetching product sizes:", error);
      throw error;
    }
  },

  getProductSizes: async (productId: number) => {
    try {
      const response = await axios.get(`${apiUrl}/products/${productId}/sizes`);
      return response.data.data.sizes;
    } catch (error) {
      console.error(`Error fetching sizes for product ${productId}:`, error);
      throw error;
    }
  },

  getAllProductCategory: async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`);
      return response.data.data.categories;
    } catch (error) {
      console.error("Error fetching product categories:", error);
      throw error;
    }
  },

  getProductCategory: async (productId: number) => {
    try {
      const response = await axios.get(`${apiUrl}/products/${productId}/categories`);
      return response.data.data.categories; 
    } catch (error) {
      console.error(`Error fetching categories for product ${productId}:`, error);
      throw error;
    }
  }
};

export default ProductService;
