const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all sales records
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM sales';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Create a sales record
router.post('/', (req, res) => {
  const { productID, saleDate, quantitySold } = req.body;

  // Input validation
  if (!productID || !quantitySold || quantitySold <= 0) {
    return res.status(400).json({ error: 'Valid productID and quantitySold are required' });
  }

  // Get the price per unit from the products table
  const sqlGetPrice = 'SELECT pricePerUnit FROM products WHERE productID = ?';
  db.query(sqlGetPrice, [productID], (err, priceResult) => {
    if (err) {
      console.error('Error fetching product price:', err);
      return res.status(500).json({ error: 'Failed to fetch product price' });
    }

    if (priceResult.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const pricePerUnit = priceResult[0].pricePerUnit;

    // Calculate the total amount for the sale
    const totalAmount = pricePerUnit * quantitySold;

    // Decrease stock in products table
    const sqlUpdateStock = 'UPDATE products SET stockQuantity = stockQuantity - ? WHERE productID = ?';
    db.query(sqlUpdateStock, [quantitySold, productID], (err, results) => {
      if (err) {
        console.error('Error updating stock after sale:', err);
        return res.status(500).json({ error: 'Failed to update stock after sale' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if the product has sufficient stock for the sale
      const sqlCheckStock = 'SELECT stockQuantity FROM products WHERE productID = ?';
      db.query(sqlCheckStock, [productID], (err, stockResult) => {
        if (err) {
          console.error('Error checking stock:', err);
          return res.status(500).json({ error: 'Failed to check stock' });
        }

        const updatedStockQuantity = stockResult[0]?.stockQuantity;
        if (updatedStockQuantity < 0) {
          return res.status(400).json({ error: 'Insufficient stock to complete the sale' });
        }

        // Insert the sale record into the sales table
        const sqlSale = 'INSERT INTO sales (productID, saleDate, quantitySold, totalAmount) VALUES (?, ?, ?, ?)';
        db.query(sqlSale, [productID, saleDate, quantitySold, totalAmount], (err, results) => {
          if (err) {
            console.error('Error recording sale:', err);
            return res.status(500).json({ error: 'Failed to record sale' });
          }

          res.json({ message: 'Sale recorded successfully!', saleID: results.insertId });
        });
      });
    });
  });
});

// Update a sales record
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { productID, saleDate, quantitySold } = req.body;

  // Input validation
  if (!productID || !quantitySold || quantitySold <= 0) {
    return res.status(400).json({ error: 'Valid productID and quantitySold are required' });
  }

  // Get the price per unit from the products table
  const sqlGetPrice = 'SELECT pricePerUnit FROM products WHERE productID = ?';
  db.query(sqlGetPrice, [productID], (err, priceResult) => {
    if (err) {
      console.error('Error fetching product price:', err);
      return res.status(500).json({ error: 'Failed to fetch product price' });
    }

    if (priceResult.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const pricePerUnit = priceResult[0].pricePerUnit;

    // Calculate the total amount for the updated sale
    const totalAmount = pricePerUnit * quantitySold;

    // Update the sale record
    const sqlUpdateSale = 'UPDATE sales SET productID = ?, saleDate = ?, quantitySold = ?, totalAmount = ? WHERE saleID = ?';
    db.query(sqlUpdateSale, [productID, saleDate, quantitySold, totalAmount, id], (err, results) => {
      if (err) {
        console.error('Error updating sale:', err);
        return res.status(500).json({ error: 'Failed to update sale' });
      }

      res.json({ message: 'Sales record updated successfully!' });
    });
  });
});

// Delete a sales record
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // Get the sales details to reverse the stock update
  const selectSql = 'SELECT productID, quantitySold FROM sales WHERE saleID = ?';
  db.query(selectSql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching sale record:', err);
      return res.status(500).json({ error: 'Failed to fetch sale record' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Sale record not found' });
    }

    const { productID, quantitySold } = results[0];

    // Reverse the stock update in products table
    const updateProductSql = 'UPDATE products SET stockQuantity = stockQuantity + ? WHERE productID = ?';
    db.query(updateProductSql, [quantitySold, productID], (err, updateResults) => {
      if (err) {
        console.error('Error reversing product stock:', err);
        return res.status(500).json({ error: 'Failed to reverse product stock' });
      }

      // Delete the sale record
      const deleteSaleSql = 'DELETE FROM sales WHERE saleID = ?';
      db.query(deleteSaleSql, [id], (err, deleteResults) => {
        if (err) {
          console.error('Error deleting sale record:', err);
          return res.status(500).json({ error: 'Failed to delete sale record' });
        }

        res.json({ message: 'Sales record deleted and stock restored successfully!' });
      });
    });
  });
});

module.exports = router;
