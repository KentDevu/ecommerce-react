import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarComponent from '../navbar';

const LayoutComponent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <NavbarComponent />
      <main className="flex-grow mt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutComponent;
