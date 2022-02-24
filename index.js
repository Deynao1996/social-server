const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const messagesRoute = require('./routes/messages');
const conversationsRoute = require('./routes/conversations');


app.use(cors());
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DBConnection Successful'))
  .catch((e) => console.log(e));

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/post', postRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/conversations', conversationsRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});