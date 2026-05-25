import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAddBookMutation } from "../../../redux/features/books/booksApi";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #35314a",
  background: "#1a1825",
  color: "#ffffff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#c8bfe0",
  marginBottom: "6px",
};

const AddBook = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [addBook, { isLoading }] = useAddBookMutation();

  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleAddCategory = async () => {
    setCategoryError("");
    if (!newCategoryName.trim()) {
      setCategoryError("Please enter a category name.");
      return;
    }
    setCategoryLoading(true);
    try {
      await axios.post(`${getBaseUrl()}/api/categories`, { name: newCategoryName.trim() });
      setNewCategoryName("");
      setShowAddCategory(false);
      await fetchCategories();
      Swal.fire({ title: "Category Added!", icon: "success", timer: 1500, showConfirmButton: false, background: "#211f2e", color: "#f0eeff" });
    } catch (err) {
      setCategoryError(err.response?.data?.message || "Failed to add category.");
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

      Swal.fire({ title: "Book Added!", text: "Your book was uploaded successfully!", icon: "success", confirmButtonText: "OK", background: "#211f2e", color: "#f0eeff", confirmButtonColor: "#7c3aed" });

      reset();
      setImageFileName("");
      setImageFile(null);
    } catch (error) {
      console.error(error);
      Swal.fire({ title: "Error", text: "Failed to add book. Please try again.", icon: "error", background: "#211f2e", color: "#f0eeff" });
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
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "560px" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
          Add New Book
        </h2>
        <p style={{ fontSize: "13px", color: "#a89fc0", marginTop: "4px" }}>
          Fill in the details to add a new book to the store
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* TITLE */}
        <div>
          <label style={labelStyle}>Title</label>
          <input
            {...register("title", { required: true })}
            placeholder="Enter book title"
            style={inputStyle}
          />
          {errors.title && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>Title is required.</p>}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            {...register("description")}
            placeholder="Enter book description"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label style={labelStyle}>Category</label>
          <select
            {...register("category", { required: true })}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="" style={{ background: "#211f2e" }}>Choose a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name} style={{ background: "#211f2e" }}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>Category is required.</p>}

          <button
            type="button"
            onClick={() => { setShowAddCategory(!showAddCategory); setCategoryError(""); }}
            style={{ marginTop: "8px", background: "none", border: "none", color: "#c4b5fd", fontSize: "13px", cursor: "pointer", padding: 0, fontWeight: "500" }}
          >
            {showAddCategory ? "✕ Cancel" : "+ Add New Category"}
          </button>

          {showAddCategory && (
            <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                placeholder="e.g. Biography"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={categoryLoading}
                style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
              >
                {categoryLoading ? "..." : "Save"}
              </button>
            </div>
          )}
          {categoryError && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>{categoryError}</p>}
        </div>

        {/* TRENDING */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#211f2e", border: "1px solid #35314a", borderRadius: "10px", padding: "12px 16px" }}>
          <input
            type="checkbox"
            {...register("trending")}
            id="trending"
            style={{ width: "16px", height: "16px", accentColor: "#7c3aed", cursor: "pointer" }}
          />
          <label htmlFor="trending" style={{ color: "#c8bfe0", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
            Mark as Trending
          </label>
        </div>

        {/* PRICES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Old Price (Rs.)</label>
            <input
              {...register("oldPrice")}
              type="number"
              placeholder="e.g. 500"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>New Price (Rs.)</label>
            <input
              {...register("newPrice")}
              type="number"
              placeholder="e.g. 350"
              style={inputStyle}
            />
          </div>
        </div>

        {/* COVER IMAGE */}
        <div>
          <label style={labelStyle}>Cover Image</label>
          <div style={{ border: "1px dashed #35314a", borderRadius: "10px", padding: "20px", textAlign: "center", background: "#1a1825", cursor: "pointer" }}
            onClick={() => document.getElementById("coverImageInput").click()}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>📷</div>
            <p style={{ color: "#a89fc0", fontSize: "13px" }}>Click to select image</p>
            <input
              id="coverImageInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          {imageFileName && (
            <p style={{ color: "#34d399", fontSize: "13px", marginTop: "8px", fontWeight: "500" }}>
              ✅ Selected: {imageFileName}
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "13px",
            background: isLoading ? "#4a3880" : "#7c3aed",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {isLoading ? "Adding Book..." : "Add Book"}
        </button>

      </form>
    </div>
  );
};

export default AddBook;