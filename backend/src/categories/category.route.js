const express = require("express");
const router = express.Router();
const Category = require("../model/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ message: "Category name is required" });
  try {
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });
    if (existing)
      return res.status(409).json({ message: "Category already exists" });
    const category = new Category({ name: name.trim() });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;