
import Category from "../models/Category.js"
import slugify from "slugify";
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
    const { id } = req.params
    const deleteCategory = await Category.findByIdAndDelete(id)
    return res.status(200).json({ error: false, message: "category delete successfull", deleteCategory })

  } catch (error) {
    return res.status(500).json({ error: true, message: "server error" })
  }

}
const updateCategory = async (req, res) => {
  try {

    const { id } = req.params

    const { name } = req.body


    const updateCategory = await Category.findByIdAndUpdate(id,{
      name,
      slug:slugify(name,{lower:true}),
      createdBy:req.user._id
    },{new:true})

    return res.status(201).json({ error: false, message: "category update successfull",updateCategory })

  } catch (error) {
    return res.status(500).json({ error: false, message: "server error" })
  }
}

export { createCategory, getCategory, deleteCategory, updateCategory };
