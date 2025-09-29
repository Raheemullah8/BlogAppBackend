
import Category from "../models/Category.js"
import slugify from "slugify";
import Post from "../models/Post.js"
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({
      name,
      slug: slugify(name, { lower: true }),
      createdBy: req.user._id, // admin id
    });

    await category.save();

    return res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
    console.log(error);
  }
};
const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({});

    if (categories.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No categories found.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Categories fetched successfully.",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message, // Add this for better debugging
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: true, message: "Category not found" });
    }

    // 2. 🚨 CHECK FOR ASSOCIATED POSTS 🚨
    // Find at least one post with this category ID
    const associatedPost = await Post.findOne({ category: id });

    if (associatedPost) {
      // If a post is found, send an error message and DO NOT delete the category
      return res.status(400).json({ 
        error: true, 
        message: "This category is linked to existing posts. Please delete all associated posts first." 
      });
    }

    // 3. If no associated posts are found, proceed with category deletion
    const deletedCategory = await Category.findByIdAndDelete(id);

    // Note: The previous line `await Post.deleteMany({category:id});` is now removed/unnecessary
    // because we confirmed no posts exist.

    return res.status(200).json({ 
      error: false, 
      message: "Category deleted successfully.", 
      deletedCategory 
    });

  } catch (error) {
    console.error("Error deleting category:", error); // For server-side debugging
    return res.status(500).json({ error: true, message: "Server error" });
  }
};
const updateCategory = async (req, res) => {
  try {

    const { id } = req.params

    const { name } = req.body


    const updateCategory = await Category.findByIdAndUpdate(id, {
      name,
      slug: slugify(name, { lower: true }),
      createdBy: req.user._id
    }, { new: true })

    return res.status(201).json({ error: false, message: "category update successfull", updateCategory })

  } catch (error) {
    return res.status(500).json({ error: false, message: "server error" })
  }
}

export { createCategory, getCategory, deleteCategory, updateCategory };
