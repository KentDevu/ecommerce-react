import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../../models/product';

interface ProductPopupProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, sizeId: number, quantity: number) => void;
  selectedSize: number | null;
  onSizeSelect: (sizeId: number) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  error: string | null;
  filteredProducts: Product[];
  switchToProduct: (product: Product) => void;
}

const ProductPopup: React.FC<ProductPopupProps> = ({
  product,
  onClose,
  onAddToCart,
  error,
  filteredProducts,
  switchToProduct
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, onSizeSelect] = useState<number>(1);

  const modalRef = useRef<HTMLDivElement>(null);

  // Default index 0 in sizes
  useEffect(() => {
    if (product.sizes.length > 0) {
      onSizeSelect(product.sizes[0].size_id); // Set default size
    }
  }, [product.sizes]);

  // Handle click outside of modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle quantity change
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(event.target.value);
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="fixed top-6 right-72 text-gray-400 hover:text-gray-600 text-3xl font-bold"
      >
        &times;
      </button>
      <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-4xl mt-10 mb-10 p-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
            <img
              src={product.product_image}
              alt={product.product_name}
              className="object-contain w-full h-full rounded-lg shadow-md"
            />
          </div>
          <div className="w-full md:w-2/3 md:ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">{product.product_name}</h2>
            <p className="text-gray-700 mb-4">{product.product_description}</p>
            <span className="text-xl font-bold text-gray-900">${product.product_price}</span>

            {/* Size Selector */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Size</h3>
              <div className="flex space-x-2 mt-2">
                {product.sizes.map((size) => (
                  <span
                    key={size.size_id}
                    onClick={() => onSizeSelect(size.size_id)}
                    className={`px-3 py-1 border border-gray-300 rounded-lg cursor-pointer ${
                      size.size_id === selectedSize ? 'bg-blue-200' : ''
                    }`}
                  >
                    {size.size_label}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4">
              {error && <span className="text-red-600">{error}</span>}
              <h3 className="text-lg font-semibold text-gray-800">Quantity (Available: {product.stock})</h3>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stock}
                className="border border-gray-300 rounded-lg px-3 py-1 w-20"
              />
            </div>

            <button
              onClick={() => onAddToCart(product, selectedSize || -1, quantity)}
              disabled={!selectedSize || quantity <= 0 || quantity > product.stock}
              className="ml-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Other Products */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts
              .filter((otherProduct) => otherProduct.product_id !== product.product_id) // Exclude the currently selected product
              .map((otherProduct) => (
                <div
                  key={otherProduct.product_id}
                  onClick={() => switchToProduct(otherProduct)}
                  className="bg-gray-900 border border-gray-200 rounded-lg shadow cursor-pointer transition-transform transform hover:scale-105"
                >
                  <img
                    src={otherProduct.product_image}
                    alt={otherProduct.product_name}
                    className="object-cover w-full h-48 rounded-t-lg"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white">{otherProduct.product_name}</h4>
                    <p className="text-gray-400">${otherProduct.product_price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopup;
