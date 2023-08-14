import Post from "../models/postsModel.js";
import User from "../models/User.js";
//create post
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        //create new post with this data in DB
        const newPost = new Post({
            userId, firstName: user.firstName,
            //come from data base of the user 
            lastName: user.lastName, location: user.location,
            description, userPicturePath: user.picturePath,
            picturePath, likes: {}, comments: []
        });
        //save the created post to db
        await newPost.save();
        //get all posts to front end and refresh it with the updated posts
        const post = await Post.find();
        res.status(201).json(post);
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
};
//getFeedPosts get all posts from freinds
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post)
    }
    catch (err) {
        res.status(404).json({ message: err.message })
    }
};
//getUserPosts the freind posts
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}
//update likedPost like and dislike posts
export const likedPost = async (req, res) => {
    try {
        //post id send in url ,userid from body(data)
        const { id } = req.params;
        const { userId } = req.body;
        //select the relevent post by id
        const post = await Post.findById(id);
        //check in likes if userid exist
        const isLiked = post.likes.get(userId);
        //if exist remove if not add
        if (isLiked) {//remove like
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }//the updated post 
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        )
        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}