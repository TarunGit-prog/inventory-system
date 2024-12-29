const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all suppliers
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM suppliers';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching suppliers:', err);
      return res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
    res.json(results);
  });
});

// Create a new supplier
router.post('/', (req, res) => {
  const { supplierName, contactName, contactEmail, contactPhone, address } = req.body;

  // Input validation
  if (!supplierName || !contactName || !contactEmail || !contactPhone || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO suppliers (supplierName, contactName, contactEmail, contactPhone, address) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [supplierName, contactName, contactEmail, contactPhone, address], (err, results) => {
    if (err) {
      console.error('Error adding supplier:', err);
      return res.status(500).json({ error: 'Failed to create supplier' });
    }

    res.json({ message: 'Supplier created successfully!', supplierID: results.insertId });
  });
});

// Update a supplier
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { supplierName, contactName, contactEmail, contactPhone, address } = req.body;

  // Input validation
  if (!supplierName || !contactName || !contactEmail || !contactPhone || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'UPDATE suppliers SET supplierName = ?, contactName = ?, contactEmail = ?, contactPhone = ?, address = ? WHERE supplierID = ?';
  db.query(sql, [supplierName, contactName, contactEmail, contactPhone, address, id], (err, results) => {
    if (err) {
      console.error('Error updating supplier:', err);
      return res.status(500).json({ error: 'Failed to update supplier' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ message: 'Supplier updated successfully!' });
  });
});

// Delete a supplier
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Check if supplier is referenced in any products
  const checkSql = 'SELECT COUNT(*) AS count FROM products WHERE supplierID = ?';
  db.query(checkSql, [id], (err, results) => {
    if (err) {
      console.error('Error checking supplier references:', err);
      return res.status(500).json({ error: 'Failed to check supplier references' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete supplier with associated products' });
    }

    // Proceed with deletion
    const sql = 'DELETE FROM suppliers WHERE supplierID = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error deleting supplier:', err);
        return res.status(500).json({ error: 'Failed to delete supplier' });
      }

      res.json({ message: 'Supplier deleted successfully!' });
    });
  });
});

module.exports = router;
