import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const createComment = async (req, res) => {
    try {
        // Ensure req.user exists before proceeding
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        const { postid } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }
        const post = await Post.findById(postid);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = new Comment({
            content,
            author: req.user._id,
            post: postid
        });
        await comment.save();
        return res.status(201).json({ message: "Comment created successfully", comment });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message || "Internal server error" });
    }
}


export { createComment };