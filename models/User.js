const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, min: 3, max: 20},
  email: {type: String, required: true, max: 50, lowercase: true},
  password: {type: String, required: true, min: 6},
  name: {type: String, required: true, lowercase: true},
  lastName: {type: String, required: true, lowercase: true},
  profilePicture: {type: String, default: 'https://kremen.gov.ua/assets/images/no-user-icon.jpg'},
  coverPicture: {type: String, default: 'https://blog.depositphotos.com/wp-content/uploads/2017/07/Soothing-nature-backgrounds-2.jpg.webp'},
  followers: {type: Array, default: []},
  following: {type: Array, default: []},  
  ignoring: {type: Array, default: []},
  isAdmin: {type: Boolean, default: false},
  descr: {type: String, max: 50, default: 'Welcome to my Profile!'},
  city: {type: String, max: 50, default: 'No information yet', lowercase: true},
  from: {type: String, max: 50, default: 'No information yet', lowercase: true},
  relationship: {type: Number, enum: [0, 1, 2, 3]}
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);