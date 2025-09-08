import monoose from "mongoose";
const { Schema, model } = monoose;
const postSchema = new Schema({
    title: String,
    body: String,
    username: String,
    categories: {
        type: Array,
        default: []
    },
    photo: String
}, { timestamps: true });
const Post = model("Post", postSchema);
export default Post;