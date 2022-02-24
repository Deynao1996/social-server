const router = require('express').Router();
const Conversation = require('../models/Conversation');


//Create conversation
router.post('/', async (req, res) => {
  const newConversation = Conversation({
    members: [req.body.senderId, req.body.receiverId]
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (e) {
    res.status(500).json(e)
  }
});

// Get conversations
router.get('/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({members: {$in: [req.params.userId]}});
    res.status(200).json(conversations.reverse());
  } catch (e) {
    res.status(500).json(e)
  }
});

//Delete conversation
router.delete('/delete/:id', async (req, res) => {
  try {
    const post = await Conversation.findById(req.params.id);
    await post.deleteOne();
    res.status(200).json('Conversation has been deleted');
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;