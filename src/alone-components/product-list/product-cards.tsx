import React, { useEffect, useState } from 'react';
import ProductService from '../../services/product-service';
import { Product } from '../../models/product';
import { truncate } from '../../utils/truncate';

interface ProductCardsComponentProps {
  selectedCategory: number | null;
  searchTerm: string;
  onSelectProduct: (product: Product) => void;
}

const ProductCardsComponent: React.FC<ProductCardsComponentProps> = ({
  selectedCategory,
  searchTerm,
  onSelectProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
        console.log(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.categories.some(category => category.category_id === selectedCategory);
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredProducts.map(product => (
        <div
          key={product.product_id}
          onClick={() => onSelectProduct(product)}
          className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow cursor-pointer transition-transform transform hover:scale-105"
        >
          <a className="block relative overflow-hidden rounded-t-lg">
            <img
              className="object-cover w-full h-64"
              src={product.product_image}
              alt={product.product_name}
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center text-white text-lg font-bold">
              {truncate(product.product_name, 20)}
            </div>
          </a>
          <div className="px-5 pb-5">
            <div className="mt-4 mb-4">
              <h2 className="text-sm font-semibold tracking-tight text-gray-900">
                {truncate(product.product_description, 50)}
              </h2>
            </div>
            <div className="flex flex-col items-start mt-auto">
              <span className="text-xl font-bold text-gray-900 mb-3">
                ${product.product_price}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(product);
                }}
                className="text-white bg-gray-900 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardsComponent;
