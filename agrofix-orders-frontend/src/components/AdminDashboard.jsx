// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, deleteProduct, fetchProducts } from '../services/api';
import AdminProductForm from './AdminProductForm';


const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [productFormMode, setProductFormMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update the local orders state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Failed to update order status.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Refresh products would go here if we had a product state
        // For now, just show success message
        alert('Product deleted successfully');
      } catch (err) {
        setError('Failed to delete product.');
      }
    }
  };

  const handleProductFormSubmit = () => {
    setProductFormMode(null);
    setSelectedProduct(null);
    // Refresh products would go here
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Orders
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
      </div>
      
      {activeTab === 'orders' && (
        <div className="orders-panel">
          <h3>All Orders</h3>
          
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.buyer_name}</td>
                  <td>{order.buyer_contact}</td>
                  <td>{order.items.length} items</td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'products' && (
        <div className="products-panel">
          {productFormMode ? (
            <AdminProductForm 
              mode={productFormMode} 
              product={selectedProduct}
              onSubmit={handleProductFormSubmit}
              onCancel={() => {
                setProductFormMode(null);
                setSelectedProduct(null);
              }}
            />
          ) : (
            <>
              <div className="product-actions">
                <h3>Product Management</h3>
                <button 
                  className="add-product-btn"
                  onClick={() => setProductFormMode('add')}
                >
                  Add New Product
                </button>
              </div>
              
              <div className="product-management">
                <ProductList 
                  onEdit={(product) => {
                    setSelectedProduct(product);
                    setProductFormMode('edit');
                  }}
                  onDelete={handleDeleteProduct}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Admin version of ProductList with edit/delete actions
const ProductList = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products.');
        setLoading(false);
      }
    };
    
    getProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>${product.price}</td>
            <td>
              <button onClick={() => onEdit(product)} className="edit-btn">Edit</button>
              <button onClick={() => onDelete(product.id)} className="delete-btn">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminDashboard;