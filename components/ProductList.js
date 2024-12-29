import React, { useState, useEffect } from 'react';
import api from '../api';
import './list.css'
function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    pricePerUnit: '',
    stockQuantity: '',
    thresholdFrequency: '',
    categoryID: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null); // Track product being updated

  // Fetch products and categories
  const fetchProducts = () => {
    api.get('/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  const fetchCategories = () => {
    api.get('/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle adding a new product
  const handleAddProduct = (e) => {
    e.preventDefault();

    const { productName, pricePerUnit, stockQuantity, thresholdFrequency, categoryID } = newProduct;
    if (!productName || !pricePerUnit || !stockQuantity || !thresholdFrequency || !categoryID) {
      alert('All fields are required');
      return;
    }

    api.post('/products', newProduct)
      .then(() => {
        fetchProducts();
        setNewProduct({
          productName: '',
          pricePerUnit: '',
          stockQuantity: '',
          thresholdFrequency: '',
          categoryID: '',
        });
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        alert('There was an error adding the product. Please try again.');
      });
  };

  // Handle updating a product
  const handleUpdateProduct = (e) => {
    e.preventDefault();

    if (!selectedProduct) return;

    api.put(`/products/${selectedProduct.productID}`, selectedProduct)
      .then(() => {
        fetchProducts();
        setSelectedProduct(null); // Close update form
      })
      .catch((error) => {
        console.error('Error updating product:', error);
        alert('There was an error updating the product. Please try again.');
      });
  };

  // Handle deleting a product
  const handleDeleteProduct = (id) => {
    api.delete(`/products/${id}`)
      .then(() => fetchProducts())
      .catch((error) => {
        console.error('Error deleting product:', error);
        alert('There was an error deleting the product. Please try again.');
      });
  };

  return (
    <div>
      <h3>Add New Product</h3>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.productName}
          onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price Per Unit"
          value={newProduct.pricePerUnit}
          onChange={(e) => setNewProduct({ ...newProduct, pricePerUnit: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={newProduct.stockQuantity}
          onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Threshold Frequency"
          value={newProduct.thresholdFrequency}
          onChange={(e) => setNewProduct({ ...newProduct, thresholdFrequency: e.target.value })}
        />
        <select
          value={newProduct.categoryID}
          onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.categoryID} value={category.categoryID}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <button type="submit">Add Product</button>
      </form>

      <h3>Existing Products</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price Per Unit</th>
            <th>Stock Quantity</th>
            <th>Threshold Frequency</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productID}>
              <td>{product.productName}</td>
              <td>{product.pricePerUnit}</td>
              <td>{product.stockQuantity}</td>
              <td>{product.thresholdFrequency}</td>
              <td>
                {
                  categories.find((category) => category.categoryID === product.categoryID)?.categoryName || 'Unknown'
                }
              </td>
              <td>
                <button onClick={() => setSelectedProduct(product)}>Update</button>
                <button onClick={() => handleDeleteProduct(product.productID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Product Form */}
      {selectedProduct && (
        <div>
          <h3>Update Product</h3>
          <form onSubmit={handleUpdateProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={selectedProduct.productName}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, productName: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price Per Unit"
              value={selectedProduct.pricePerUnit}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, pricePerUnit: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={selectedProduct.stockQuantity}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, stockQuantity: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Threshold Frequency"
              value={selectedProduct.thresholdFrequency}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, thresholdFrequency: e.target.value })
              }
            />
            <select
              value={selectedProduct.categoryID}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, categoryID: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductList;
