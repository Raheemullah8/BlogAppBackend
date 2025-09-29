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
const getComments = async (req, res) => {
    try {
        const { postid } = req.params;
        const comments = await Comment.find({ post: postid })
            .populate("author", "name  profileImage")
            .sort({ createdAt: -1 })
        return res.status(200).json({ error: false, message: "data fetch successfull", comments })

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message || "Internal server error" });
    }
}
const deleteComment = async (req, res) => {
    try {
        const { commentid } = req.params;
        const commit = await Comment.findById(commentid);

        if (!commit) return res.status(404).json({ message: "Comment not found" });
        if (commit.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        await Comment.findByIdAndDelete(commentid);
        return res.status(200).json({ message: "Comment deleted successfully" });


    } catch (error) {
        return res.status(500).json({ error: true, message: error.message || "Internal server error" });
    }
}


const getAllComment = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("author", "name profileImage")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      error: false,
      message: "All comments fetched successfully",
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Internal server error",
    });
  }
};







export { createComment, getComments,deleteComment,getAllComment};