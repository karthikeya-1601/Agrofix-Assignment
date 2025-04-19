// src/components/AdminProductForm.jsx
import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../services/api';

const AdminProductForm = ({ mode = 'add', product = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        price: product.price
      });
    }
  }, [mode, product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    
    setLoading(true);
    try {
      if (mode === 'add') {
        await addProduct(productData);
      } else {
        await updateProduct(product.id, productData);
      }
      setLoading(false);
      onSubmit();
    } catch (err) {
      setError(`Failed to ${mode === 'add' ? 'add' : 'update'} product.`);
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h3>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price per Unit ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add Product' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;