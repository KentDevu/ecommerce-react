import { useState, useEffect } from 'react';
import axios from 'axios';
import TokenService from './token-service';

const CartService = () => {
  const apiUrl = 'http://localhost/ecommerce-api/public/api';
  const [cartItemCount, setCartItemCount] = useState(0);
  const tokenService = TokenService();

  const insertProductToCart = async (product) => {
    try {
      const response = await axios.post(`${apiUrl}/cart`, product);
      console.log('Product added to cart:', response.data);
      getCart(); // Fetch updated cart count
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const getCart = async () => {
    try {
      const userId = 1; // Set your user ID here
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // Fetch the cart data
      const response = await axios.get(`${apiUrl}/cart`);

      // Log the response data to inspect its structure
      console.log('Response data:', response.data);

      // Access the cart items from the response.data.data property
      const cartItems = Array.isArray(response.data.data.carts) ? response.data.data.carts : [];
      console.log(cartItems);

      // Filter cart items to only include those with the matching userId
      const filteredItems = cartItems.filter(item => item.user_id === userId);
      console.log(filteredItems);

      // Update the cart count with the total quantity
      updateCartCount(filteredItems);

      return filteredItems;
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const editCart = async (userId, productId, sizeId, quantity) => {
    try {
      const response = await axios.put(`${apiUrl}/cart/${userId}/${productId}/${sizeId}`, { quantity });
      console.log('Cart updated:', response.data);
      getCart(); // Fetch updated cart count
    } catch (error) {
      console.error('Error editing cart:', error);
    }
  };

  const deleteItemFromCart = async (userId, productId, sizeId) => {
    try {
      const response = await axios.delete(`${apiUrl}/cart/${userId}/${productId}/${sizeId}`);
      console.log('Item deleted from cart:', response.data);
      getCart(); // Fetch updated cart count
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };

  const updateCartCount = (cartItems) => {
    const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartItemCount(totalQuantity);
  };

  useEffect(() => {
    getCart();
  }, []);

  return {
    cartItemCount,
    insertProductToCart,
    getCart,
    editCart,
    deleteItemFromCart,
  };
};

export default CartService;
