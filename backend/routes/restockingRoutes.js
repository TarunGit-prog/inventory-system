const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all restocking records
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM restocking';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Create a restocking record and update the products table
router.post('/', (req, res) => {
  const { productID, supplierID, restockDate, quantityRestocked } = req.body;

  // Input validation
  if (!productID || !quantityRestocked || quantityRestocked <= 0) {
    return res.status(400).json({ error: 'Valid productID and quantityRestocked are required' });
  }

  // Insert into the restocking table
  const insertRestockSql = 'INSERT INTO restocking (productID, supplierID, restockDate, quantityRestocked) VALUES (?, ?, ?, ?)';
  db.query(insertRestockSql, [productID, supplierID, restockDate, quantityRestocked], (err, results) => {
    if (err) {
      console.error('Error creating restocking record:', err);
      return res.status(500).json({ error: 'Failed to create restocking record' });
    }

    // Update the products table with the new stock quantity
    const updateProductSql = 'UPDATE products SET stockQuantity = stockQuantity + ? WHERE productID = ?';
    db.query(updateProductSql, [quantityRestocked, productID], (err, updateResults) => {
      if (err) {
        console.error('Error updating product stock:', err);
        return res.status(500).json({ error: 'Failed to update product stock' });
      }

      // Check if the product exists in the products table
      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Restocking record created and product stock updated successfully!' });
    });
  });
});

// Update a restocking record
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { productID, supplierID, restockDate, quantityRestocked } = req.body;

  // Input validation
  if (!productID || !quantityRestocked || quantityRestocked <= 0) {
    return res.status(400).json({ error: 'Valid productID and quantityRestocked are required' });
  }

  // Fetch the original restocking record to reverse the stock update
  const selectOriginalRestockSql = 'SELECT productID, quantityRestocked FROM restocking WHERE restockID = ?';
  db.query(selectOriginalRestockSql, [id], (err, originalRestockResult) => {
    if (err) {
      console.error('Error fetching original restocking details:', err);
      return res.status(500).json({ error: 'Failed to fetch original restocking details' });
    }

    if (originalRestockResult.length === 0) {
      return res.status(404).json({ error: 'Restocking record not found' });
    }

    const { productID: originalProductID, quantityRestocked: originalQuantityRestocked } = originalRestockResult[0];

    // Reverse the stock update for the original restocking
    const reverseStockUpdateSql = 'UPDATE products SET stockQuantity = stockQuantity - ? WHERE productID = ?';
    db.query(reverseStockUpdateSql, [originalQuantityRestocked, originalProductID], (err, reverseResults) => {
      if (err) {
        console.error('Error reversing stock update:', err);
        return res.status(500).json({ error: 'Failed to reverse stock update' });
      }

      // Update the restocking record
      const updateRestockSql = 'UPDATE restocking SET productID = ?, supplierID = ?, restockDate = ?, quantityRestocked = ? WHERE restockID = ?';
      db.query(updateRestockSql, [productID, supplierID, restockDate, quantityRestocked, id], (err, updateResults) => {
        if (err) {
          console.error('Error updating restocking record:', err);
          return res.status(500).json({ error: 'Failed to update restocking record' });
        }

        // Update the product stock with the new quantity
        const updateProductSql = 'UPDATE products SET stockQuantity = stockQuantity + ? WHERE productID = ?';
        db.query(updateProductSql, [quantityRestocked, productID], (err, productResults) => {
          if (err) {
            console.error('Error updating product stock:', err);
            return res.status(500).json({ error: 'Failed to update product stock' });
          }

          res.json({ message: 'Restocking record and product stock updated successfully!' });
        });
      });
    });
  });
});

// Delete a restocking record
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Get the restocking details to reverse the stock update
  const selectSql = 'SELECT productID, quantityRestocked FROM restocking WHERE restockID = ?';
  db.query(selectSql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching restocking record:', err);
      return res.status(500).json({ error: 'Failed to fetch restocking record' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Restocking record not found' });
    }

    const { productID, quantityRestocked } = results[0];

    // Delete the restocking record
    const deleteRestockSql = 'DELETE FROM restocking WHERE restockID = ?';
    db.query(deleteRestockSql, [id], (err, deleteResults) => {
      if (err) {
        console.error('Error deleting restocking record:', err);
        return res.status(500).json({ error: 'Failed to delete restocking record' });
      }

      // Reverse the stock update in the products table
      const updateProductSql = 'UPDATE products SET stockQuantity = stockQuantity - ? WHERE productID = ?';
      db.query(updateProductSql, [quantityRestocked, productID], (err, updateResults) => {
        if (err) {
          console.error('Error reversing product stock:', err);
          return res.status(500).json({ error: 'Failed to reverse product stock update' });
        }

        res.json({ message: 'Restocking record deleted and product stock reversed successfully!' });
      });
    });
  });
});

module.exports = router;
