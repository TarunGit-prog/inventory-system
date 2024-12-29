const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all categories
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM categories';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    res.json(results);
  });
});

// Create a category
router.post('/', (req, res) => {
    const { categoryName, description } = req.body;  // No need for categoryId, as it's auto-incremented
    console.log(categoryName, description)
    const sql = 'INSERT INTO categories (categoryName, description) VALUES (?, ?)';
    
    db.query(sql, [categoryName, description], (err, results) => {
      if (err) {
        if (err.sqlState === '45000') {
          // Trigger error (e.g., price validation failed)
          return res.status(400).json({ error: err.message });
        }
        console.error('Error adding category:', err);
        return res.status(500).json({ error: 'Failed to create category' });
      }
      
      res.json({ message: 'Category created successfully!', categoryID: results.insertId });  // Return the new categoryID
    });
});

// Update a category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { categoryName, description } = req.body;

  // Validate input
  if (!categoryName || !description) {
    return res.status(400).json({ error: 'Category name and description are required' });
  }

  const sql = 'UPDATE categories SET categoryName = ?, description = ? WHERE categoryID = ?';
  db.query(sql, [categoryName, description, id], (err, results) => {
    if (err) {
      if (err.sqlState === '45000') {
        // Trigger error (e.g., price validation failed)
        return res.status(400).json({ error: err.message });
      }
      console.error('Error updating category:', err);
      return res.status(500).json({ error: 'Failed to update category' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully!' });
  });
});

// Delete a category
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Check if category is referenced in products
  const checkSql = 'SELECT COUNT(*) AS count FROM products WHERE categoryID = ?';
  db.query(checkSql, [id], (err, results) => {
    if (err) {
      console.error('Error checking category references:', err);
      return res.status(500).json({ error: 'Failed to check category references' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with associated products' });
    }

    // Proceed with deletion
    const sql = 'DELETE FROM categories WHERE categoryID = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        if (err.sqlState === '45000') {
          // Trigger error (e.g., stock alert trigger raised)
          return res.status(400).json({ error: err.message });
        }
        console.error('Error deleting category:', err);
        return res.status(500).json({ error: 'Failed to delete category' });
      }

      res.json({ message: 'Category deleted successfully!' });
    });
  });
});

module.exports = router;
