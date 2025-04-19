// src/App.jsx
import React, { useState } from 'react';
import Layout from './components/Layout';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';
import './styles.css';

const App = () => {
  const [page, setPage] = useState('products');
  const [isAdmin, setIsAdmin] = useState(false); // In a real app, this would come from authentication

  // Simple routing
  const renderPage = () => {
    switch (page) {
      case 'products':
        return <ProductList />;
      case 'order':
        return <OrderForm />;
      case 'track':
        return <OrderTracker />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ProductList />;
    }
  };

  // Override the default navigation behavior
  React.useEffect(() => {
    const handleNavigation = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        setPage(href.substring(1) || 'products');
      }
    };

    document.addEventListener('click', handleNavigation);
    return () => document.removeEventListener('click', handleNavigation);
  }, []);

  // Toggle admin mode for demo purposes (in a real app, this would use authentication)
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    if (!isAdmin && page !== 'admin') {
      setPage('admin');
    }
  };

  return (
    <Layout isAdmin={isAdmin}>
      <div className="app">
        {renderPage()}
        <button onClick={toggleAdminMode} className="admin-toggle">
          {isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}
        </button>
      </div>
    </Layout>
  );
};

export default App;