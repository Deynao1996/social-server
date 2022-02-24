const router = require('express').Router();
const User = require('../models/User');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');


//Update user
router.put('/update/:id', async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
      $set: req.body,
      },
      {new: true}
    );
    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

//Get followers
router.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const {followers, following, ...rest} = user._doc;

    const followingUsers = await Promise.all(
      user.following.map(friendId => {
        return User.findOne({_id: friendId});
      })
    );
    const followerUsers = await Promise.all(
      user.followers.map(friendId => {
        return User.findOne({_id: friendId});
      })
    );
    
    res.status(200).json({followingUsers, followerUsers});
  } catch (e) {
    res.status(500).json(e);
  }
});

//Delete user
router.delete('/delete/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('Account has been deleted');
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get user
router.get('/get/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, isAdmin, ...others} = user._doc;
    res.status(200).json(others);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get all users
router.get('/getAll', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Follow user
router.put('/follow/:id', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.userId);

      if (currentUser.following.includes(req.params.id)) {
        res.status(403).json('You already have been subscribed');
      } else {
        await currentUser.updateOne({$push: {following: req.params.id}});

        await User.findByIdAndUpdate(
          req.params.id,
          {
          $push: {followers: req.body.userId} 
          },
          {new: true}
          );
          res.status(200).json('You have been started following user');
        }   
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(403).json('You can not follow yourself')
  }
});

//Unfollow user 
router.put('/unfollow/:id', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.userId);

      if (!currentUser.following.includes(req.params.id)) {
        res.status(403).json('You are not following this user');
      } else {
        await currentUser.updateOne({$pull: {following: req.params.id}});

        await User.findByIdAndUpdate(
          req.params.id,
          {
          $pull: {followers: req.body.userId} 
          },
          {new: true}
        );
        res.status(200).json('You have been finished following user');
    }   
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(403).json('You can not unfollow yourself')
  }
});

module.exports = router;