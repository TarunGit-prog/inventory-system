const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all products
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// Create a new product
router.post('/', (req, res) => {
  const { productName, pricePerUnit, stockQuantity, restockThreshold, categoryID } = req.body;

  // Input validation
  if (!productName || !pricePerUnit || !stockQuantity || !restockThreshold || !categoryID) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO products (productName, pricePerUnit, stockQuantity, restockThreshold, categoryID) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [productName, pricePerUnit, stockQuantity, restockThreshold, categoryID], (err, results) => {
    if (err) {
      // Check if the error is related to the trigger (e.g., price validation or stock threshold)
      if (err.sqlState === '45000') {
        return res.status(400).json({ error: err.message });  // Handle custom trigger errors
      }

      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Failed to create product' });
    }

    res.json({ message: 'Product created successfully!', productID: results.insertId });
  });
});

// Update a product
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { productName, pricePerUnit, stockQuantity, restockThreshold, categoryID } = req.body;

  // Input validation
  if (!productName || !pricePerUnit || !stockQuantity || !restockThreshold || !categoryID) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'UPDATE products SET productName = ?, pricePerUnit = ?, stockQuantity = ?, restockThreshold = ?, categoryID = ? WHERE productID = ?';
  db.query(sql, [productName, pricePerUnit, stockQuantity, restockThreshold, categoryID, id], (err, results) => {
    if (err) {
      // Check if the error is related to the trigger (e.g., price validation or stock threshold)
      if (err.sqlState === '45000') {
        return res.status(400).json({ error: err.message });  // Handle custom trigger errors
      }

      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update product' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully!' });
  });
});

// Delete a product
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM products WHERE productID = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      // Check if the error is related to the trigger (e.g., stock threshold alert)
      if (err.sqlState === '45000') {
        return res.status(400).json({ error: err.message });  // Handle custom trigger errors
      }

      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully!' });
  });
});

module.exports = router;
