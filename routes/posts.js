const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User")
//create Post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});
//update Post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//delete Post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you delete only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// like/dislike a Post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a Post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user all post

router.get("/profile/:username", async (req, res) => {
  try {
    // console.log("start");
    const user = await  User.findOne({username:req.params.username})
    // console.log(user)
    const posts =await Post.find({userId:user._id})
    // console.log(posts)
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});
//get a timeline Posts

router.get("/timeline/:userId", async (req, res) => {
 
  try {
    //  console.log("start");

    const currentUser = await User.findById(req.params.userId);
    
    const userPosts = await Post.find({ userId: currentUser._id });
    // console.log(userPosts)
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts))
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
