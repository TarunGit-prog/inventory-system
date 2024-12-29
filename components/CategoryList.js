import React, { useState, useEffect } from 'react';
import api from '../api'; // Ensure the API configuration is properly set up
import './list.css'
function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: '',
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories from the backend
  const fetchCategories = () => {
    api
      .get('/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = (e) => {
    e.preventDefault();

    if (!newCategory.categoryName || !newCategory.description) {
      alert('Category Name and Description are required');
      return;
    }

    api
      .post('/categories', newCategory)
      .then(() => {
        fetchCategories();
        setNewCategory({ categoryName: '', description: '' });
      })
      .catch((error) => {
        console.error('Error adding category:', error);
        alert('Error adding the category. Please try again.');
      });
  };

  // Handle updating a category
  const handleUpdateCategory = (e) => {
    e.preventDefault();

    if (!selectedCategory) return;

    if (!selectedCategory.categoryName || !selectedCategory.description) {
      alert('Category Name and Description are required');
      return;
    }

    api
      .put(`/categories/${selectedCategory.categoryID}`, selectedCategory)
      .then(() => {
        fetchCategories();
        setSelectedCategory(null);
      })
      .catch((error) => {
        console.error('Error updating category:', error);
        alert('Error updating the category. Please try again.');
      });
  };

  // Handle deleting a category
  const handleDeleteCategory = (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    api
      .delete(`/categories/${id}`)
      .then(() => fetchCategories())
      .catch((error) => {
        console.error('Error deleting category:', error);
        alert('Error deleting the category. Please try again.');
      });
  };

  return (
    <div>
      <h3>Add New Category</h3>
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.categoryName}
          onChange={(e) =>
            setNewCategory({ ...newCategory, categoryName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Category Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
        <button type="submit">Add Category</button>
      </form>

      <h3>Existing Categories</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryID}>
              <td>{category.categoryName}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => setSelectedCategory(category)}>
                  Update
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.categoryID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Category Form */}
      {selectedCategory && (
        <div>
          <h3>Update Category</h3>
          <form onSubmit={handleUpdateCategory}>
            <input
              type="text"
              placeholder="Category Name"
              value={selectedCategory.categoryName}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  categoryName: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Category Description"
              value={selectedCategory.description}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  description: e.target.value,
                })
              }
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setSelectedCategory(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CategoryList;
