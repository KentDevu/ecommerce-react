import React, { useState, useEffect } from 'react';
import ProductService from '../../services/product-service';
import { Product } from '../../models/product';

type CategoryListComponentProps = {
  selectedCategory: number | null;
  onSelectCategory: (category_id: number | null) => void;
};

const CategoryListComponent: React.FC<CategoryListComponentProps> = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState<{ category_id: number; category_name: string }[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await ProductService.getAllProductCategory();
        if (Array.isArray(categoryData)) {
            setCategories(categoryData);
        } else {
            console.error("API did not return an array of categories");
            setCategories([]);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap max-w-full w-full overflow-auto bg-white shadow-md rounded-lg border border-gray-300 p-4">
        <button 
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 border border-gray-300 rounded-lg mr-2 mb-2 cursor-pointer transition-transform transform hover:scale-105 flex-shrink-0 ${selectedCategory === null ? 'bg-gray-900 text-white' : ''}`}
        >
          All Products
        </button>
        <div className="flex flex-wrap max-w-full">
          {categories.map(category => (
            <button 
              key={category.category_id}
              onClick={() => onSelectCategory(category.category_id)}
              className={`px-4 py-2 border border-gray-300 rounded-lg mr-2 mb-2 cursor-pointer transition-transform transform hover:scale-105 flex-shrink-0 ${selectedCategory === category.category_id ? 'bg-gray-900 text-white' : ''}`}
            >
              {category.category_name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryListComponent;
