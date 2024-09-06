import React, { useState, useEffect } from 'react';
import CartService from '../../services/cart-service';
import { CartItem } from '../../models/cart-item';

const CardProductCardsComponent = () => {
  const [products, setProducts] = useState<CartItem[]>([]);
  const { getCart, editCart, deleteItemFromCart } = CartService();
  const [allSelected, setAllSelected] = useState(false);

  //get cart items
  useEffect(() => {
    const fetchCart = async () => {
      const response = await getCart();
      if (response) {
        setProducts(response); // Update the state with filtered cart items
        console.log('Fetched cart items:', response);
      }
    };
  
    fetchCart();
  }, []); // Empty dependency array means this runs once on mount

  
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setAllSelected(checked);
    setProducts(products.map(product => ({ ...product, selected: checked })));
  };

  const handleToggleSelection = (item: CartItem) => {
    setProducts(products.map(product =>
      product.product_id === item.product_id && product.size_id === item.size_id
        ? { ...product, selected: !product.selected }
        : product
    ));
  };

  const handleDecreaseQuantity = async (productId: number, sizeId: number, quantity: number) => {
    await editCart(1, productId, sizeId, Math.max(1, quantity - 1));
    setProducts(products.map(product =>
      product.product_id === productId && product.size_id === sizeId
        ? { ...product, quantity: Math.max(1, quantity - 1) }
        : product
    ));
  };

  const handleIncreaseQuantity = async (productId: number, sizeId: number, quantity: number) => {
    await editCart(1, productId, sizeId, quantity + 1);
    setProducts(products.map(product =>
      product.product_id === productId && product.size_id === sizeId
        ? { ...product, quantity: quantity + 1 }
        : product
    ));
  };

  const handleQuantityChange = async (event: React.ChangeEvent<HTMLInputElement>, productId: number, sizeId: number) => {
    const quantity = Math.max(1, Number(event.target.value));
    await editCart(1, productId, sizeId, quantity);
    setProducts(products.map(product =>
      product.product_id === productId && product.size_id === sizeId
        ? { ...product, quantity }
        : product
    ));
  };

  const handleRemoveFromCart = async (productId: number, sizeId: number) => {
    await deleteItemFromCart(1, productId, sizeId);
    setProducts(products.filter(product =>
      product.product_id !== productId || product.size_id !== sizeId
    ));
  };

  const getTotalPrice = () => {
    return products
      .filter(product => product.selected)
      .reduce((total, item) => total + item.product_price * item.quantity, 0);
  };

  const hasSelectedItems = () => products.some(item => item.selected);

  return (
    <>
    {products.length === 0 ? (<div className="text-center text-gray-900">Your cart is empty.</div>) : (
      <>
          {/* Select All Checkbox */}
          <div className="mb-4">
            <input
              type="checkbox"
              id="selectAll"
              onChange={handleSelectAll}
              checked={allSelected}
              className="custom-checkbox mr-4"
              />
            <label htmlFor="selectAll" className="ml-2">Select All</label>
          </div>

          <ul className="divide-y divide-gray-200">
            {products.map((item, i) => (
              <li key={i} className="py-4 w-[85%] flex items-center justify-between cursor-pointer transition ease-in-out delay-150 hover:-translate-x-3 hover:scale-130 duration-300 hover:shadow-sm">
                <div className="flex items-center space-x-4">
                  {/* Checkbox for each item */}
                  <input
                    type="checkbox"
                    checked={item.selected || false}
                    onChange={() => handleToggleSelection(item)}
                    className="custom-checkbox mr-4"
                    />
                  <img src={item.product_image} alt="Product Image" className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h2 className="text-xl font-semibold">{item.product_name}</h2>
                    <p>Size: {item.size_label}</p>
                    <p>Price: ${item.product_price}</p>
                    <p>Quantity:
                      <button onClick={() => handleDecreaseQuantity(item.product_id, item.size_id, item.quantity)} className="px-2 py-1 border border-gray-300 rounded-lg">-</button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(e, item.product_id, item.size_id)}
                        className="w-16 text-center border border-gray-300 rounded-lg mx-2"
                        min="1"
                        />
                      <button onClick={() => handleIncreaseQuantity(item.product_id, item.size_id, item.quantity)} className="px-2 py-1 border border-gray-300 rounded-lg">+</button>
                    </p>
                  </div>
                </div>
                <button onClick={() => handleRemoveFromCart(item.product_id, item.size_id)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Remove</button>
              </li>
            ))}
          </ul>
          {/* Total Price */}
          <div className="mt-6 flex justify-between">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
          </div>
            
          <button
            className={`mt-4 w-full py-2 font-semibold rounded-lg ${getTotalPrice() === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-600'} text-white`}
            disabled={getTotalPrice() === 0}
          >
            Proceed to Checkout
          </button>
         </>
      )}
      </>
  )
}

export default CardProductCardsComponent