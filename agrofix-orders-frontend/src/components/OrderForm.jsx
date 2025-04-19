// src/components/OrderForm.jsx
import React, { useState } from 'react';
import ProductList from './ProductList';
import { placeOrder } from '../services/api';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_contact: '',
    delivery_address: ''
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductSelect = (product) => {
    const existingProductIndex = selectedProducts.findIndex(p => p.id === product.id);
    
    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      
      if (product.quantity > 0) {
        updatedProducts[existingProductIndex] = product;
      } else {
        updatedProducts.splice(existingProductIndex, 1);
      }
      
      setSelectedProducts(updatedProducts);
    } else if (product.quantity > 0) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      setError('Please select at least one product');
      return;
    }

    const orderData = {
      ...formData,
      items: selectedProducts.map(p => ({
        product_id: p.id,
        quantity: p.quantity,
        price: p.price
      }))
    };

    setLoading(true);
    try {
      const response = await placeOrder(orderData);
      setOrderId(response.id);
      setOrderPlaced(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-success">
        <h2>Order Placed Successfully!</h2>
        <p>Your order ID is: <strong>{orderId}</strong></p>
        <p>You can use this ID to track your order status.</p>
        <button onClick={() => window.location.href = '/track'} className="track-btn">
          Track Order
        </button>
      </div>
    );
  }

  return (
    <div className="order-form-container">
      <h2>Place Bulk Order</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="buyer_name">Name</label>
          <input
            type="text"
            id="buyer_name"
            name="buyer_name"
            value={formData.buyer_name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="buyer_contact">Contact Number</label>
          <input
            type="tel"
            id="buyer_contact"
            name="buyer_contact"
            value={formData.buyer_contact}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="delivery_address">Delivery Address</label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            value={formData.delivery_address}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="selected-products">
          <h3>Selected Products</h3>
          {selectedProducts.length === 0 ? (
            <p>No products selected</p>
          ) : (
            <ul>
              {selectedProducts.map(product => (
                <li key={product.id}>
                  {product.name} - {product.quantity} units (${product.price * product.quantity})
                </li>
              ))}
            </ul>
          )}
          <p className="total">
            Total: ${selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
          </p>
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      
      <ProductList onSelectProduct={handleProductSelect} selectedProducts={selectedProducts} />
    </div>
  );
};

export default OrderForm;