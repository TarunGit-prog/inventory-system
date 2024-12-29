import React, { useState, useEffect } from 'react';
import api from '../api';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Fetch suppliers
  const fetchSuppliers = () => {
    api.get('/suppliers')
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error('Error fetching suppliers:', error));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle adding a new supplier
  const handleAddSupplier = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!newSupplier.supplierName || !newSupplier.contactName || !newSupplier.contactEmail || !newSupplier.contactPhone || !newSupplier.address) {
      alert('All fields are required');
      return;
    }

    api.post('/suppliers', newSupplier)
      .then(() => {
        fetchSuppliers();
        setNewSupplier({
          supplierName: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          address: '',
        });
      })
      .catch((error) => {
        console.error('Error adding supplier:', error);
        alert('There was an error adding the supplier. Please try again.');
      });
  };

  // Handle updating a supplier
  const handleUpdateSupplier = (e) => {
    e.preventDefault();

    if (!selectedSupplier) return;

    api.put(`/suppliers/${selectedSupplier.supplierID}`, selectedSupplier)
      .then(() => {
        fetchSuppliers();
        setSelectedSupplier(null);
      })
      .catch((error) => {
        console.error('Error updating supplier:', error);
        alert('There was an error updating the supplier. Please try again.');
      });
  };

  // Handle deleting a supplier
  const handleDeleteSupplier = (id) => {
    api.delete(`/suppliers/${id}`)
      .then(() => fetchSuppliers())
      .catch((error) => {
        console.error('Error deleting supplier:', error);
        alert('There was an error deleting the supplier. Please try again.');
      });
  };

  return (
    <div>
      <h3>Add New Supplier</h3>
      <form onSubmit={handleAddSupplier}>
        <input
          type="text"
          placeholder="Supplier Name"
          value={newSupplier.supplierName}
          onChange={(e) => setNewSupplier({ ...newSupplier, supplierName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Name"
          value={newSupplier.contactName}
          onChange={(e) => setNewSupplier({ ...newSupplier, contactName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={newSupplier.contactEmail}
          onChange={(e) => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Phone"
          value={newSupplier.contactPhone}
          onChange={(e) => setNewSupplier({ ...newSupplier, contactPhone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={newSupplier.address}
          onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
        />
        <button type="submit">Add Supplier</button>
      </form>

      <h3>Existing Suppliers</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Contact Name</th>
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.supplierID}>
              <td>{supplier.supplierName}</td>
              <td>{supplier.contactName}</td>
              <td>{supplier.contactEmail}</td>
              <td>{supplier.contactPhone}</td>
              <td>{supplier.address}</td>
              <td>
                <button onClick={() => setSelectedSupplier(supplier)}>Update</button>
                <button onClick={() => handleDeleteSupplier(supplier.supplierID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Supplier Form */}
      {selectedSupplier && (
        <div>
          <h3>Update Supplier</h3>
          <form onSubmit={handleUpdateSupplier}>
            <input
              type="text"
              placeholder="Supplier Name"
              value={selectedSupplier.supplierName}
              onChange={(e) =>
                setSelectedSupplier({ ...selectedSupplier, supplierName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Contact Name"
              value={selectedSupplier.contactName}
              onChange={(e) =>
                setSelectedSupplier({ ...selectedSupplier, contactName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Contact Email"
              value={selectedSupplier.contactEmail}
              onChange={(e) =>
                setSelectedSupplier({ ...selectedSupplier, contactEmail: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Contact Phone"
              value={selectedSupplier.contactPhone}
              onChange={(e) =>
                setSelectedSupplier({ ...selectedSupplier, contactPhone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address"
              value={selectedSupplier.address}
              onChange={(e) =>
                setSelectedSupplier({ ...selectedSupplier, address: e.target.value })
              }
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setSelectedSupplier(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SupplierList;
