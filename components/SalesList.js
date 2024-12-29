import React, { useState, useEffect } from 'react';
import api from '../api';
import './list.css'
function SalesList() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]); // For product options
  const [newSale, setNewSale] = useState({
    productID: '',
    quantitySold: '',
    saleDate: '',
  });
  const [selectedSale, setSelectedSale] = useState(null);

  // Fetch sales and products
  const fetchSales = () => {
    api.get('/sales')
      .then((response) => setSales(response.data))
      .catch((error) => console.error('Error fetching sales:', error));
  };

  const fetchProducts = () => {
    api.get('/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  // Handle adding a new sale
  const handleAddSale = (e) => {
    e.preventDefault();

    const { productID, quantitySold, saleDate } = newSale;
    if (!productID || !quantitySold || !saleDate) {
      alert('All fields are required');
      return;
    }

    api.post('/sales', newSale)
      .then(() => {
        fetchSales();
        setNewSale({ productID: '', quantitySold: '', saleDate: '' });
      })
      .catch((error) => {
        console.error('Error adding sale:', error);
        alert('There was an error adding the sale. Please try again.');
      });
  };

  // Handle updating a sale
  const handleUpdateSale = (e) => {
    e.preventDefault();

    if (!selectedSale) return;

    api.put(`/sales/${selectedSale.saleID}`, selectedSale)
      .then(() => {
        fetchSales();
        setSelectedSale(null);
      })
      .catch((error) => {
        console.error('Error updating sale:', error);
        alert('There was an error updating the sale. Please try again.');
      });
  };

  // Handle deleting a sale
  const handleDeleteSale = (id) => {
    api.delete(`/sales/${id}`)
      .then(() => fetchSales())
      .catch((error) => {
        console.error('Error deleting sale:', error);
        alert('There was an error deleting the sale. Please try again.');
      });
  };

  return (
    <div>
      <h3>Add New Sale</h3>
      <form onSubmit={handleAddSale}>
        <select
          value={newSale.productID}
          onChange={(e) => setNewSale({ ...newSale, productID: e.target.value })}
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
          placeholder="Quantity Sold"
          value={newSale.quantitySold}
          onChange={(e) => setNewSale({ ...newSale, quantitySold: e.target.value })}
        />
        <input
          type="date"
          value={newSale.saleDate}
          onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
        />
        <button type="submit">Add Sale</button>
      </form>

      <h3>Existing Sales</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Sale Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.saleID}>
              <td>
                {products.find((product) => product.productID === sale.productID)?.productName ||
                  'Unknown'}
              </td>
              <td>{sale.quantitySold}</td>
              <td>{sale.saleDate}</td>
              <td>
                <button onClick={() => setSelectedSale(sale)}>Update</button>
                <button onClick={() => handleDeleteSale(sale.saleID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Sale Form */}
      {selectedSale && (
        <div>
          <h3>Update Sale</h3>
          <form onSubmit={handleUpdateSale}>
            <select
              value={selectedSale.productID}
              onChange={(e) =>
                setSelectedSale({ ...selectedSale, productID: e.target.value })
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
              placeholder="Quantity Sold"
              value={selectedSale.quantitySold}
              onChange={(e) =>
                setSelectedSale({ ...selectedSale, quantitySold: e.target.value })
              }
            />
            <input
              type="date"
              value={selectedSale.saleDate}
              onChange={(e) =>
                setSelectedSale({ ...selectedSale, saleDate: e.target.value })
              }
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setSelectedSale(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SalesList;
