// routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new order
router.post('/', async (req, res) => {
  try {
    const { 
      buyer_name, 
      buyer_contact, 
      delivery_address, 
      items,
      status = 'pending' // Default status
    } = req.body;
    
    // Basic validation
    if (!buyer_name || !buyer_contact || !delivery_address || !items) {
      return res.status(400).json({ 
        error: 'Missing required fields: buyer_name, buyer_contact, delivery_address, and items are required' 
      });
    }
    
    // Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }
    
    const result = await db.query(
      'INSERT INTO orders (buyer_name, buyer_contact, delivery_address, items, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [buyer_name, buyer_contact, delivery_address, JSON.stringify(items), status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT (update) an order status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    // Check if order exists
    const checkResult = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;