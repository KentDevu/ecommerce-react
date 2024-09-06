import React, { useState, useEffect } from 'react';

//import components
import CardProductCardsComponent from '../alone-components/cart-list/cart-product-cards';

const CartListPage = () => {
  return (
    <div>
      <header>
        <h1>Your Cart</h1>
      </header>
      <div className="container mx-auto p-4 flex">
        <div className="py-8 px-4 mx-auto max-w-screen-xl flex-1">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold text-center mb-6">Your Cart</h2>
            < CardProductCardsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartListPage;
