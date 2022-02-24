const mongoose = require('mongoose');


const CommentsSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  commentId: {type: String, required: true},
  message: {type: String, required: true},
  name: {type: String, required: true},
  lastName: {type: String, required: true},
  profilePicture: {type: String, required: true},
}, {timestamps: true});

const PostSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  descr: {type: String, max: 500},
  tags: {type: String, default: ''},
  media: {type: String},
  likes: {type: Array, default: []},
  comments: {type: [CommentsSchema], default: []}
}, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);