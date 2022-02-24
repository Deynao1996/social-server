const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');


//Create a post
router.post('/create', async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(e);
  }
});

//Update post
router.put('/update/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.updateOne({$set: req.body});
      res.status(200).json('Post has been updated');
    } else {
      res.status(403).json('You can update only your posts');
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//Delete post 
router.delete('/delete/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();
    res.status(200).json('Post has been deleted');
  } catch (e) {
    res.status(500).json(e);
  }
});

//Like / dislike post
router.put('/like/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({$pull: {likes: req.body.userId}});
      res.status(200).json('You disliked this post');
    } else {
      await post.updateOne({$push: {likes: req.body.userId}});
      res.status(200).json('Post has been licked');
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//Add comment
router.put('/comment/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const {comments} = await Post.findOne({"_id": req.params.id}, {comments: {$elemMatch: {commentId: req.body.commentId}}});

    if (comments.length == 0) {
      await post.updateOne({$push: {comments: req.body}});
    } else {
      await post.updateOne({$pull: {comments: {commentId: req.body.commentId}}});
    }
    
    res.status(200).json('Your comment has been changed');
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get timeline
router.get('/timeline/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userPosts = await Post.find({userId: req.params.userId});
    const friendsPosts = await Promise.all(
      user.following.map(friendId => {
        return Post.find({userId: friendId});
      })
    );

    const allPosts = userPosts.concat(...friendsPosts);
    const sortedPosts = allPosts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    res.status(200).json(sortedPosts);
  } catch (e) {
    res.status(500).json(e);
  }    
});

module.exports = router;