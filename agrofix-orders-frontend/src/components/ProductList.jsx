// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';

const ProductList = ({ onSelectProduct, selectedProducts = [] }) => {
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
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    getProducts();
  }, []);

  const handleSelectProduct = (product, quantity) => {
    if (quantity > 0 && onSelectProduct) {
      onSelectProduct({ ...product, quantity });
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h2>Available Products</h2>
      <div className="products-grid">
        {products.map(product => {
          const isSelected = selectedProducts.some(p => p.id === product.id);
          const selectedQuantity = isSelected ? 
            selectedProducts.find(p => p.id === product.id).quantity : 0;
          
          return (
            <div key={product.id} className={`product-card ${isSelected ? 'selected' : ''}`}>
              <h3>{product.name}</h3>
              <p className="price">${product.price} per unit</p>
              {onSelectProduct && (
                <div className="product-actions">
                  <input
                    type="number"
                    min="0"
                    value={selectedQuantity}
                    onChange={(e) => handleSelectProduct(product, parseInt(e.target.value))}
                    className="quantity-input"
                  />
                  <button 
                    onClick={() => handleSelectProduct(product, selectedQuantity + 1)}
                    className="add-btn"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;