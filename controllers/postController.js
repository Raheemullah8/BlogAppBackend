import postSchema from "../models/Post.js"
import categorySchema from "../models/Category.js"


const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        let postimage = "";

        if (req.file) {
            postimage = req.file.path;
        }
        if (!title || !content || !category || !postimage) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const categoryFound = await categorySchema.findById(category);
        if (!categoryFound) {
            return res.status(404).json({ message: "Category not found" })
        }
        const author = req.user._id;

        const newPost = await new postSchema({
            title,
            content,
            category,
            postimage,
            author
        })
        await newPost.save();
        return res.status(201).json({ error: false, message: "Post created successfully", newPost })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
}
const getAllPost = async (req, res) => {
    try {
        const posts = await postSchema.find({})
            .populate("category", "name slug")
            .populate('author', 'name email profileImage');

                // FIX: Combine 'return' with the response
        return res.status(200)
            .json({
                error: false,
                message: "Posts fetched successfully.",
                data: posts,
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
};
const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postSchema.findById(id)
            .populate("category", "name")
            .populate('author', 'name email profileImage');

        if (!post) return res.status(404).json({ message: "Post not found" })
        return res.status(200).json({ error: false, message: "single post fetch successfull", post })

    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error" });
    }
}
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postSchema.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" })
        await postSchema.findByIdAndDelete(id);
        return res.status(200).json({ error: false, message: "Post deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error" });
    }

}
export { createPost, getAllPost, getSinglePost, deletePost }