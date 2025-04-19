// src/components/Layout.jsx
import React from 'react';

const Layout = ({ children, isAdmin = false }) => {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Agrofix</h1>
        <nav>
          <ul>
            <li><a href="/">Products</a></li>
            <li><a href="/order">Place Order</a></li>
            <li><a href="/track">Track Order</a></li>
            {isAdmin && <li><a href="/admin">Admin Dashboard</a></li>}
          </ul>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>© 2025 Agrofix - Bulk Fruit and Vegetable Orders</p>
      </footer>
    </div>
  );
};

export default Layout;