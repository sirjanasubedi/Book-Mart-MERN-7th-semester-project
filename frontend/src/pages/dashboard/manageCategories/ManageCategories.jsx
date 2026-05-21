import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import getBaseUrl from '../../../utils/baseURL';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const baseUrl = getBaseUrl();

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post(`${baseUrl}/api/categories`, {
        name: newCategory.trim(),
      });
      setCategories([...categories, response.data]);
      setNewCategory('');
      toast.success('Category added successfully');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Category already exists');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add category');
      }
      console.error('Error adding category:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${baseUrl}/api/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Categories</h2>

      {/* Add Category Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            {isAdding ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">All Categories</h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories yet. Add one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{category.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
