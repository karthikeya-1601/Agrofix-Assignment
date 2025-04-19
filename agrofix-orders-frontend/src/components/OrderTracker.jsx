// src/components/OrderTracker.jsx
import React, { useState } from 'react';
import { getOrderById } from '../services/api';

const OrderTracker = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError('Order not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'in progress': return 'status-progress';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };

  return (
    <div className="order-tracker">
      <h2>Track Your Order</h2>
      
      <form onSubmit={handleSubmit} className="tracker-form">
        <div className="form-group">
          <label htmlFor="orderId">Order ID</label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your order ID"
            required
          />
        </div>
        
        <button type="submit" className="track-btn" disabled={loading}>
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {order && (
        <div className="order-details">
          <h3>Order Details</h3>
          
          <div className="order-info">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Buyer:</strong> {order.buyer_name}</p>
            <p><strong>Contact:</strong> {order.buyer_contact}</p>
            <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
            <p className={`status ${getStatusClass(order.status)}`}>
              <strong>Status:</strong> {order.status}
            </p>
          </div>
          
          <h4>Items</h4>
          <ul className="order-items">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product_name || 'Product'} - {item.quantity} units 
                (${(item.price * item.quantity).toFixed(2)})
              </li>
            ))}
          </ul>
          
          <p className="total">
            <strong>Total:</strong> $
            {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;