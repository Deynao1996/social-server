const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('./verifyToken.js');


//Register
router.post('/register', async (req, res) => {
  const {username, email, password, name, lastName} = req.body;
  const newUser = new User({
    username,
    email,
    name,
    lastName,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
  });

  try {
    const existingEmail = await User.findOne({email});
    const existingUserName = await User.findOne({username});

    if (existingEmail || existingUserName) {
      res.status(400).json({errorMessage: 'This user already exist'});
    }

    const createdUser = await newUser.save();

    res.status(200).json(createdUser);
  } catch(e) {
    res.status(500).json(e);
  }
});

//Login
router.post('/login', async (req, res) => {
  const {email, password: qPassword} = req.body;

  try {
    const user = await User.findOne({email});

    !user && res.status(401).json({errorMessage: 'Wrong credentials'});

    const {password, ...rest} = user._doc;
    const hashedPassword = CryptoJS.AES.decrypt(password, process.env.PASS_SEC);
    const stringPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (qPassword !== stringPassword) {
      res.status(401).json({errorMessage: 'Wrong credentials'});
    }

    const accessToken = jwt.sign({
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      password: stringPassword
    }, process.env.JWT_SEC, {expiresIn: '3d'});

    res.status(200).json({...rest, accessToken});
  } catch (e) {
    res.status(500).json(e);
  }
});

//Login with JWT
router.get('/login/withToken', verifyToken, async (req, res) => {
  const {email, password: passwordJWT} = req.user;
  const accessToken = req.token;
  try {
    const user = await User.findOne({email});

    !user && res.status(401).json({errorMessage: 'Wrong credentials'});

    const {password, ...rest} = user._doc;
    const hashedPassword = CryptoJS.AES.decrypt(password, process.env.PASS_SEC);
    const stringPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (passwordJWT !== stringPassword) {
      res.status(401).json({errorMessage: 'Wrong credentials'});
    }

    res.status(200).json({...rest, accessToken});
  } catch (e) {
      res.status(500).json(e);
  }
});

module.exports = router;