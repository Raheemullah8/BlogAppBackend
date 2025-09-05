
import Category from "../modles/Category.js"
import slugify from "slugify";
const createCategory = async (req, res) => {
  try {
   const {name} = req.body; 

    if (!name) return res.status(400).json({ message: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({
      name,
      slug: slugify(name, { lower: true }),
      createdBy: req.user._id, // admin id
    });

    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log(error);
  }
};

export { createCategory };
