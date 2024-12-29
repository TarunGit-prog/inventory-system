import React, { useState, useEffect } from 'react';
import api from '../api';
import './list.css'
function RestockingList() {
  const [restocking, setRestocking] = useState([]);
  const [products, setProducts] = useState([]); // For product options
  const [newRestock, setNewRestock] = useState({
    productID: '',
    quantityRestocked: '',
    restockDate: '',
  });
  const [selectedRestock, setSelectedRestock] = useState(null);

  // Fetch restocking and products
  const fetchRestocking = () => {
    api.get('/restocking')
      .then((response) => setRestocking(response.data))
      .catch((error) => console.error('Error fetching restocking:', error));
  };

  const fetchProducts = () => {
    api.get('/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchRestocking();
    fetchProducts();
  }, []);

  // Handle adding a new restock
  const handleAddRestock = (e) => {
    e.preventDefault();

    const { productID, quantityRestocked, restockDate } = newRestock;
    if (!productID || !quantityRestocked || !restockDate) {
      alert('All fields are required');
      return;
    }

    api.post('/restocking', newRestock)
      .then(() => {
        fetchRestocking();
        setNewRestock({ productID: '', quantityRestocked: '', restockDate: '' });
      })
      .catch((error) => {
        console.error('Error adding restock:', error);
        alert('There was an error adding the restock. Please try again.');
      });
  };

  // Handle updating a restock
  const handleUpdateRestock = (e) => {
    e.preventDefault();

    if (!selectedRestock) return;

    api.put(`/restocking/${selectedRestock.restockID}`, selectedRestock)
      .then(() => {
        fetchRestocking();
        setSelectedRestock(null);
      })
      .catch((error) => {
        console.error('Error updating restock:', error);
        alert('There was an error updating the restock. Please try again.');
      });
  };

  // Handle deleting a restock
  const handleDeleteRestock = (id) => {
    api.delete(`/restocking/${id}`)
      .then(() => fetchRestocking())
      .catch((error) => {
        console.error('Error deleting restock:', error);
        alert('There was an error deleting the restock. Please try again.');
      });
  };

  return (
    <div>
      <h3>Add New Restock</h3>
      <form onSubmit={handleAddRestock}>
        <select
          value={newRestock.productID}
          onChange={(e) => setNewRestock({ ...newRestock, productID: e.target.value })}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.productID} value={product.productID}>
              {product.productName}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity Restocked"
          value={newRestock.quantityRestocked}
          onChange={(e) => setNewRestock({ ...newRestock, quantityRestocked: e.target.value })}
        />
        <input
          type="date"
          value={newRestock.restockDate}
          onChange={(e) => setNewRestock({ ...newRestock, restockDate: e.target.value })}
        />
        <button type="submit">Add Restock</button>
      </form>

      <h3>Existing Restocking</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity Restocked</th>
            <th>Restock Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restocking.map((restock) => (
            <tr key={restock.restockID}>
              <td>
                {products.find((product) => product.productID === restock.productID)?.productName ||
                  'Unknown'}
              </td>
              <td>{restock.quantityRestocked}</td>
              <td>{restock.restockDate}</td>
              <td>
                <button onClick={() => setSelectedRestock(restock)}>Update</button>
                <button onClick={() => handleDeleteRestock(restock.restockID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Restock Form */}
      {selectedRestock && (
        <div>
          <h3>Update Restock</h3>
          <form onSubmit={handleUpdateRestock}>
            <select
              value={selectedRestock.productID}
              onChange={(e) =>
                setSelectedRestock({ ...selectedRestock, productID: e.target.value })
              }
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.productName}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity Restocked"
              value={selectedRestock.quantityRestocked}
              onChange={(e) =>
                setSelectedRestock({ ...selectedRestock, quantityRestocked: e.target.value })
              }
            />
            <input
              type="date"
              value={selectedRestock.restockDate}
              onChange={(e) =>
                setSelectedRestock({ ...selectedRestock, restockDate: e.target.value })
              }
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setSelectedRestock(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default RestockingList;
