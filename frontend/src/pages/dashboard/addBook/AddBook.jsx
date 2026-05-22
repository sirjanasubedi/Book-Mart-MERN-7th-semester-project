import React, { useState, useEffect } from 'react'
import InputField from './InputField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';

const AddBook = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [addBook, { isLoading }] = useAddBookMutation();

  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleAddCategory = async () => {
    setCategoryError('');
    if (!newCategoryName.trim()) {
      setCategoryError('Please enter a category name.');
      return;
    }
    setCategoryLoading(true);
    try {
      await axios.post(`${getBaseUrl()}/api/categories`, { name: newCategoryName.trim() });
      setNewCategoryName('');
      setShowAddCategory(false);
      await fetchCategories();
      Swal.fire({ title: 'Category Added!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Failed to add category.');
    } finally {
      setCategoryLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      if (imageFile) formData.append("coverImage", imageFile);

      await addBook(formData).unwrap();

      Swal.fire({
        title: "Book Added!",
        text: "Your book was uploaded successfully!",
        icon: "success",
        confirmButtonText: "OK"
      });

      reset();
      setImageFileName('');
      setImageFile(null);
    } catch (error) {
      console.error(error);
      alert("Failed to add book. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField label="Title" name="title" placeholder="Enter book title" register={register} />
        <InputField label="Description" name="description" placeholder="Enter book description" type="textarea" register={register} />

        {/* ── Dynamic Category Dropdown ── */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            {...register('category', { required: true })}
            className="w-full border rounded p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Choose A Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">Category is required.</p>}

          <button
            type="button"
            onClick={() => { setShowAddCategory(!showAddCategory); setCategoryError(''); }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            {showAddCategory ? '✕ Cancel' : '+ Add New Category'}
          </button>

          {showAddCategory && (
            <div className="mt-2 flex gap-2 items-center">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                placeholder="e.g. Biography"
                className="flex-1 border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={categoryLoading}
                className="bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {categoryLoading ? '...' : 'Save'}
              </button>
            </div>
          )}
          {categoryError && <p className="text-red-500 text-xs mt-1">{categoryError}</p>}
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('trending')} className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500" />
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
          </label>
        </div>

        <InputField label="New Price" name="newPrice" type="number" placeholder="New Price" register={register} />

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full border rounded p-1"
          />
          {imageFileName && (
            <p className="text-sm text-green-600">✅ Selected: {imageFileName}</p>
          )}
        </div>

        <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md">
          {isLoading ? <span>Adding...</span> : <span>Add Book</span>}
        </button>
      </form>
    </div>
  );
};

export default AddBook;