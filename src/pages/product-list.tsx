import React, { useState, useEffect } from 'react';

// Components
import CategoryListComponent from '../alone-components/product-list/category-list';
import ProductCardsComponent from '../alone-components/product-list/product-cards';
import { Product } from '../models/product';
import ProductPopup from '../alone-components/product-list/product-modal';
import ProductService from '../services/product-service';

const ProductListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.categories.some(category => category.category_id === selectedCategory);
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectCategory = (category_id: number | null) => {
    setSelectedCategory(category_id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, sizeId: number, quantity: number) => {
    console.log(`Added product ${product.product_name} to cart with size ${sizeId} and quantity ${quantity}`);
  };

  const switchToProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`container mx-auto p-4 ${selectedProduct ? 'blurred' : ''}`}>
      <div className="py-8 px-4 mx-auto max-w-screen-xl min-h-screen lg:py-16 lg:px-6">
        {/* Category Filter */}
        <CategoryListComponent
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded-lg w-full cursor-pointer transition ease-in-out delay-150 hover:-translate-y-2 hover:scale-130 duration-300 hover:shadow-sm"
          />
        </div>

        {/* Product List */}
        <ProductCardsComponent
          selectedCategory={selectedCategory}
          onSelectProduct={handleSelectProduct}
          searchTerm={searchTerm}
        />
      </div>

      {/* Product Item Popup */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={handleClosePopup}
          onAddToCart={handleAddToCart}
          selectedSize={null}
          onSizeSelect={() => {}} 
          quantity={1} 
          setQuantity={() => {}} 
          error={null} 
          filteredProducts={filteredProducts} 
          switchToProduct={switchToProduct} 
        />
      )}
    </div>
  );
};

export default ProductListPage;
