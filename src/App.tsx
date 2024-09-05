import { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React from "react";

//component'
import LayoutComponent from "./shared-components/structure/Layout";
import ProductListPage from './pages/product-list'
import CartListPage from './pages/cart-list'
import ProfilePage from './pages/profile'

function App(): ReactNode {
  return (
    <Routes>
      <Route path="/" element={<LayoutComponent />}>
        <Route index path="" element={<Navigate to="products" />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="cart" element={<CartListPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App
